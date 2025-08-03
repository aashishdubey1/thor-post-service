import { DBError } from "../errors/DbError";
import { NotFoundError } from "../errors/NotFoundError";
import { IPost } from "../models/Post";
import IPostRepository from "../repository/postRepo-interface";
import { PostType } from "../schemas/Post";
import logger from "../utils/logger";

export class PostService {

    private repository;

    constructor(repository:IPostRepository){
        this.repository = repository
    }

    async createPost(data:PostType){
        try {
            const newPost = this.repository.create(data)
            logger.info("Post creatd")
            return newPost
        } catch (error) {
            logger.error(`Error creating Post ${error}`)
            throw DBError.create(error);
        }
    }

    async getPost(id:string){
        try {
            const post = await this.repository.get(id);
            if(!post){
                logger.warn("Cant find post with id")
                throw new NotFoundError("Post is not found")
            }
            return post
        } catch (error) {
            throw DBError.create(error)
        }
    }

    async getAllPost(){
        try {
             return await this.repository.getAll()
        } catch (error) {
            throw DBError.create(error)
        }
    }

    async updatePost(id:string,body:Partial<PostType>){
        try {
            const updatedPost = await this.repository.update(id,body)
            if(!updatedPost){
                logger.info("Can't find post with that id while updating");
                throw new NotFoundError("Post not Found")
            }
            return updatedPost
        } catch (error) {
            throw DBError.create(error)
        }
    }

    async deletePost(id:string){
        try {
            const deletedPost = await this.repository.delete(id);
            if(!deletedPost){
                logger.warn("Cant find post with that id while deleting");
                throw new NotFoundError("Post not found")
            }
            return deletedPost
        } catch (error) {
            throw DBError.create(error)
        }
    }
}