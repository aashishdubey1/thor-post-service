import { IPost, Post } from "../models/Post";
import { PostType } from "../schemas/Post";
import IPostRepository from "./postRepo-interface";

export class PostRepository implements IPostRepository {

    async create(data:PostType):Promise<IPost>{
        return await Post.create(data)
    }

    async get(id:string):Promise<IPost | null>{
        return await Post.findById(id)
    }

    async getAll():Promise<IPost[]>{
        return await Post.find()
    }

    async update(id:string,data:Partial<PostType>):Promise<IPost | null>{
        return await Post.findByIdAndUpdate(id,data,{new:true})
    }

    async delete(id:string):Promise<IPost | null>{
        return await Post.findByIdAndDelete(id)
    }
}