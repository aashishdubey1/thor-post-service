
import { AppError } from "./AppError";
import { StatusCodes } from "http-status-codes";
import { Error as MongooseError } from "mongoose";
import { MongoError } from "mongodb";
import logger from "../utils/logger";

export class DBError extends AppError {
    constructor(message: string, statusCode: StatusCodes = StatusCodes.INTERNAL_SERVER_ERROR) {
        super("DB_ERROR" ,statusCode, message);
    }

    public static create(originalError: unknown): DBError {

        // Check for Mongoose Validation Errors
        if (originalError instanceof MongooseError.ValidationError) {
            const validationErrors = Object.keys(originalError.errors).map(key => ({
                path: originalError.errors[key]!.path,
                message: originalError.errors[key]!.message,
            }));
            const message = `Validation failed: ${JSON.stringify(validationErrors)}`;
            return new DBError(message, StatusCodes.BAD_REQUEST,);
        }

        // Check for MongoDB Duplicate Key Errors
        if (originalError instanceof MongoError && originalError.code === 11000) {
            const duplicateField = originalError.errmsg ? originalError.errmsg.split("index:")[1]!.split(" dup key")[0]!.trim() : 'a unique field';
            const message = `A duplicate key error occurred for ${duplicateField}.`;
            return new DBError(message, StatusCodes.CONFLICT);
        }

        // Check for Mongoose Cast Errors
        if (originalError instanceof MongooseError.CastError) {
            const message = `Invalid value provided for field '${originalError.path}'. Expected type '${originalError.kind}'.`;
            return new DBError(message, StatusCodes.BAD_REQUEST,);
        }

        // Handle other unknown database errors
        const message = "An unknown database error occurred.";
        return new DBError(message, StatusCodes.INTERNAL_SERVER_ERROR,);
    }
}