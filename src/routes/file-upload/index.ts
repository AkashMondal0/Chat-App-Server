/* eslint-disable prefer-const */
import { Router } from 'express';
import { uploadFile } from '../../service/multer';
import { getObjects, putObjects } from '../../service/aws/s3';
import fs from 'fs';
import path from 'path';


const FileRouter = Router();

//! upload multiple files
FileRouter.post('/multiple/:userId/', uploadFile("multiple", 5), function (req, res) {
    // console.log("files", req.files);
    try {
        if (!req.files) {
            return res.status(400).send('No files were uploaded.');
        }
        const files = req.files as Express.Multer.File[];
        let fileLocations: string[] = [];

        // console.log(files)
        files.forEach((file: Express.Multer.File) => {
            fileLocations.push(`${process.env.HOST}/file/${req.params.userId}/${file.filename}`);
        })
        return res.status(200).json({ data: fileLocations })
    } catch (error) {
        console.log(error)
        return res.status(400).send({ message: "'No files were uploaded.'" });
    }
})


//! get file
FileRouter.get('/:userId/:fileName', (req, res) => {
    try {
        let pathName = path.join(__dirname, `../../../storage`, req.params.userId, req.params.fileName);
        const stream = fs.createReadStream(pathName)
        return stream.pipe(res).on('error', (err) => {
            console.log(err)
            return res.status(404).send({ message: 'File not found.' });
        })
    } catch (error) {
        console.log(error)
        return res.status(404).send({ message: 'File not found.' });
    }
});

FileRouter.get('/image', async (req, res) => {
    console.log("Url ", await putObjects(`image-${Date.now()}.jpeg`, "image/jpeg"))

    res.send("File Router")
});

export default FileRouter;