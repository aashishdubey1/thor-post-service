import { IPost, Post } from "../models/Post";
import logger from "../utils/logger";
import { PostSchema } from "../utils/types/PostType";
import IPostRepository from "./postRepo-interface";

export class PostRepository implements IPostRepository {

    async create(data:PostSchema):Promise<IPost>{
        logger.info("Req hitted Create post repository")
        console.log(data, "inside repo")
        return await Post.create(data)
    }

    async get(id:string):Promise<IPost | null>{
        return await Post.findById(id)
    }

    async getAll():Promise<IPost[]>{
        return await Post.find()
    }

    async update(id:string,data:Partial<PostSchema>):Promise<IPost | null>{
        return await Post.findByIdAndUpdate(id,data,{new:true})
    }

    async delete(id:string):Promise<IPost | null>{
        return await Post.findByIdAndDelete(id)
    }
}