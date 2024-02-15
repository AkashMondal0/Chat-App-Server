import { Kafka, Producer } from 'kafkajs'
import fs from 'fs'
import path from 'path'
import { saveMessageInDB, saveMessageSeenInDB } from '../controller/privateMessage';
import * as dotenv from "dotenv";
dotenv.config();

const kafka = new Kafka({
    brokers: [ process.env.KAFKA_BROKER as string],
    clientId: 'chat-app',
    ssl: {
        ca: [fs.readFileSync(path.resolve(process.env.CA_PATH as string), "utf-8")]
    },
    sasl: {
        mechanism: process.env.SASL_MECHANISM as 'plain',
        username: process.env.SASL_USERNAME as string,
        password: process.env.SASL_PASSWORD as string,
    },
});

const initKafkaAdmin = async () => {
    const admin = kafka.admin()
    await admin.connect()
    console.log('admin connected')
    await admin.createTopics({
        topics: [
            { topic: 'MESSAGES', numPartitions: 2 },
            { topic: 'MESSAGES_SEEN', numPartitions: 2 }
        ]
    })
    console.log('topics created')
    await admin.disconnect()
    console.log('admin disconnected')
}

let producer: null | Producer = null

export async function createProducer() {
    if (producer) return producer
    const _producer = kafka.producer()
    await _producer.connect()
    producer = _producer
    return producer
}

const produceMessage = async (message: string) => {
    const _producer = await createProducer()
    await _producer.send({
        topic: 'MESSAGES',
        timeout: 3000,
        messages: [
            {
                value: message,
                key: `${new Date().getTime()}`
            }
        ]
    })
    return true
}

const produceMessageSeen = async (message: string) => {
    const _producer = await createProducer()
    await _producer.send({
        topic: 'MESSAGES_SEEN',
        timeout: 3000,
        messages: [
            {
                value: message,
                key: `${new Date().getTime()}`
            }
        ]
    })
    return true
}

const consumeMessage = async () => {
    const consumer = kafka.consumer({ groupId: 'test-group' })
    await consumer.connect()
    await consumer.subscribe({
        topics: ['MESSAGES', 'MESSAGES_SEEN'],
        fromBeginning: true,
    })
    await consumer.run({
        autoCommit: true,
        eachMessage: async ({ topic, partition, message, pause }) => {
            if (!message.value) return
            try {
                switch (topic) {
                    case 'MESSAGES':
                        return await saveMessageInDB(JSON.parse(message.value.toString()))
                    case 'MESSAGES_SEEN':
                        return await saveMessageSeenInDB(JSON.parse(message.value.toString()))
                }
            } catch (error) {
                pause();
                setTimeout(() => {
                    consumer.resume([{
                        topic: topic,
                        partitions: [partition]
                    }]);
                }, 60 * 1000);
            }

        }
    })
}

const StartKafka = async () => {
    await initKafkaAdmin()
    await consumeMessage()

}
export {
    StartKafka,
    produceMessage,
    produceMessageSeen
}

export default kafka