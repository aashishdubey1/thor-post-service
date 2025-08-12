import { NextFunction, Request,Response } from "express";
import { PostRepository } from "../repository/PostRepository";
import { PostService } from "../service/PostService";
import { StatusCodes } from "http-status-codes";
import logger from "../utils/logger";
import redis from "../config/redis-config";


const postService = new PostService(new PostRepository())


export class PostController {

    async createPost(req:Request,res:Response,next:NextFunction){
        try {
            logger.info("Req hitted Create post controller")
            const user = req.user?.userId!;
            const {content,mediaUrls} = req.body
            console.log(req.body,'body inside controller')
            console.log("content inside controller",content)
            const createdPost = await postService.createPost({user,content,mediaUrls})
            return res.status(StatusCodes.CREATED).json({
                success:true,
                message:"Post created",
                data:createdPost,
                error:{}
            })
        } catch (error) {
            next(error)
        }
    }

    async getPost(req:Request,res:Response,next:NextFunction){
        try {
            const id = req.params.id;
            const posts = await postService.getPost(id!)
            res.status(StatusCodes.OK).json({
                success:true,
                message:"Post found Successfully ",
                data:posts,
                error:{}
            })
        } catch (error) {
            logger.error("Error getting post",error)
            next(error)
        }
    }

    async getAllPost(req:Request,res:Response,next:NextFunction){
        try {

            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const startIndex = ( page - 1 ) * limit

            const allPosts = await postService.getAllPost(startIndex,limit,page)

            res.status(StatusCodes.OK).json({
                success:true,
                message:"Getting all Posts",
                data:allPosts,
                error:{}
            })
        } catch (error) {
            logger.error("Error getting all post",error)
            next(error)
        }
    }

    async updatePost(req:Request,res:Response,next:NextFunction){
        try {
            const id = req.params.id;
            const data = req.body
            const updatePost = await postService.updatePost(id!,data)
            res.status(StatusCodes.OK).json({
                success:true,
                message:"Post updated",
                data:updatePost,
                error:{}
            })
        } catch (error) {
            logger.error("Error updating  post",error)
            next(error)
        }
    }

    async deletePost(req:Request,res:Response,next:NextFunction){
        try {
            const id = req.params.id;
            const deletedPost = await postService.deletePost(id!)
            res.status(StatusCodes.OK).json({
                success:true,
                message:"Post Deleted",
                data:deletedPost,
                error:{}
            })
        } catch (error) {
            logger.error("Error deleting post",error)
            next(error)
        }
    }
    
}