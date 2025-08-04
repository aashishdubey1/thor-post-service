import { DBError } from "../errors/DbError";
import { NotFoundError } from "../errors/NotFoundError";
import IPostRepository from "../repository/postRepo-interface";
import logger from "../utils/logger";
import { PostSchema } from "../utils/types/PostType";

export class PostService {

    private repository;

    constructor(repository:IPostRepository){
        this.repository = repository
    }

    async createPost(data:PostSchema){
        try {
            logger.info("Req hitted Create post service")
            console.log(data, "inside service")
            const newPost = await this.repository.create(data)
            logger.info("Post created")
            return newPost
        } catch (error) {
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

    async updatePost(id:string,body:Partial<PostSchema>){
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