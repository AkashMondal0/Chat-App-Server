/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod";

const ValidateMiddleware = (schema: z.Schema) => async (req: any, res: any, next: any) => {
    try {
        const parsedBody = await schema.parseAsync(req.body);
        req.body = parsedBody;
        next();
    } catch (error: any) {
        res.status(400).json({ message: error.errors[0].message });
    }
}

export default ValidateMiddleware;