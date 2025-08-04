import { Request, NextFunction, Response } from "express";
import { success, ZodType } from "zod";
import { BadRequestError } from "../errors/BadRequestError";

export const validateReq = <T>(schema:ZodType<T>) => (req:Request,res:Response,next:NextFunction) => {

    try {

        const result = schema.safeParse(req.body);
        if(!result.success){
            throw new BadRequestError(`Input Validaiton Failed ${result.error.issues[0]?.message}`)
        }

        req.body = result.data

        next()

    } catch (error) {
        next(error)
    }



}