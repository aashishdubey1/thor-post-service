import { IPost, Post } from "../models/Post";
import logger from "../utils/logger";
import { PostSchema } from "../utils/types/PostType";
import IPostRepository from "./postRepo-interface";

export class PostRepository implements IPostRepository {

    async create(data:PostSchema):Promise<IPost>{
        return await Post.create(data)
    }

    async get(id:string):Promise<IPost | null>{
        return await Post.findById(id)
    }

    async getAll(skip:number,limit:number):Promise<IPost[]>{
        return await Post.find().sort({createdAt:-1}).skip(skip).limit(limit)
    }

    async update(id:string,data:Partial<PostSchema>):Promise<IPost | null>{
        return await Post.findByIdAndUpdate(id,data,{new:true})
    }

    async delete(id:string):Promise<IPost | null>{
        return await Post.findByIdAndDelete(id)
    }

    async countAll(){
        return await Post.countDocuments();
    }

}