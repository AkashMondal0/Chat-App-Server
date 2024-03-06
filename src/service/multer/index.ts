import multer from 'multer';
import path from 'path';
import fs from 'fs';

export type Upload_Routes = "profile" | "post" | "comment" | "reply"
export type Upload_Type = "single" | "multiple"

export const uploadFile = (upload_Type: Upload_Type, uploadCount?: number) => {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            const pathName = path.join(__dirname, `../../../storage`, req.params.userId);
            let stat = null;
            try {
                stat = fs.statSync(pathName);
            }
            catch (err) {
                fs.mkdirSync(pathName);
            }
            if (stat && !stat.isDirectory()) {
                throw new Error('Directory cannot be created');
            }
            cb(null, pathName);
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + '-' + file.originalname);
        }
    });
    const upload = multer({ storage: storage, dest: `../storage/` });

    if (upload_Type === "multiple") {
        return upload.array("file", uploadCount);
    }

    return upload.single("file");
}