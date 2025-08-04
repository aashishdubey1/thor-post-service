import { Request, Response ,NextFunction } from "express";
import { AuthenticationError } from "../errors/AuthenticationError";
import logger from "../utils/logger";



export function authenticateReq(req:Request,res:Response,next:NextFunction){

    try {
        const userId = req.headers['x-user-id'] as string;
        if(!userId){
            logger.warn("Acess attemeped without user id")
            throw new AuthenticationError("User is not Authenticated")
        }
        req.user = {userId} 
        next()
    } catch (error) {
        next(error)
    }

}