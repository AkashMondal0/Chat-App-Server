FROM node:18
 
ENV MONGODB_URI="mongodb://16.171.183.141:27017/chatapp?authSource=admin"
ENV REDIS_URL="redis://:akash1234@16.171.183.141:6379"
ENV JWT_SECRET="dRYjpuVfGUTCDttLnTON6KBP6q1kDLUD9ocnoVZAx7Ggmr0aMWK0ABw8JbMys+QSChO0rk+Csso2blKRqZSzlmOnA1tfgQUKybSIJTavNuJF4BEiUXhP/iXa2srdKY+8PdrgRVLPnfFy/yTUY9VzfIBBQH2wNpqvSSWy5/E9zporn4kVkXIQmXm+JPF+pd6UNcRg89AQebZbc1b32hOkxPpwTAMcfYLQAOH5SfcjpcH0nBCPPqhLFxXwoRd5+PHufwwkPUKHu9STcAL4lJW1uosg8XNX5GjPLXpdSu55UWtcTWIVyAdb0FHzxoVMvcwZfZzhihwrpXiJMrorXwew2g=="

WORKDIR /app
COPY . .
RUN npm install
RUn npm install ts-node .
EXPOSE 4000
CMD ["npm","run","start"]