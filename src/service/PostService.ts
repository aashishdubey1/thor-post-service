import { EXCHANGE_NAME } from "../config/rabbitMq-config";
import redis from "../config/redis-config";
import { DBError } from "../errors/DbError";
import { NotFoundError } from "../errors/NotFoundError";
import IPostRepository from "../repository/postRepo-interface";
import logger from "../utils/logger";
import { PostSchema } from "../utils/types/PostType";
import { EventPublisher } from "./eventPublisher";

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
            await this.invalidateCache()
            return newPost
        } catch (error) {
            throw DBError.create(error);
        }
    }

    async getPost(id:string){
        try {
            const cachedKey = `Post:${id}`
            try {
                const cachedPost = await redis.get(cachedKey)
                if(cachedPost){
                    logger.info("Req hitted Create post service")
                    return JSON.parse(cachedPost)
                }
            } catch (error) {
                logger.warn("Redis read failed",error)
            }

            const post = await this.repository.get(id);
            if(!post){  
                logger.warn("Cant find post with id")
                throw new NotFoundError("Post is not found")
            }

            try {
                await redis.set(cachedKey,JSON.stringify(post),'EX',3600)
            } catch (error) {
                logger.warn('Redis write fail',error)
            }
            
            return post

        } catch (error) {
            throw DBError.create(error)
        }
    }

    async getAllPost(skip:number,limit:number,page:number){
        try {
            const cachedKey = `Posts:${page}:${limit}`

            try {
                const cachedPost = await redis.get(cachedKey)
                if(cachedPost){
                    logger.info(`Cache hit for ${cachedKey}`)
                    return JSON.parse(cachedPost!)
                }    
            } catch (error) {
                logger.warn("Redis read fail , falling back to db read",error)
            }
            
            const postsData = await this.repository.getAll(skip,limit)
            const totalNoOfPosts = await this.repository.countAll()
            const result = {
                data:postsData,
                currentPage:page,
                totalPage:Math.ceil(totalNoOfPosts/limit)
            }

           try {
             await redis.set(cachedKey,JSON.stringify(result),"EX",300)
           } catch (error) {
            logger.warn('Redia write failed',error)
           }

            return result      
            
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
            await this.invalidateCache();
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
            await this.invalidateCache();
            await EventPublisher.publicEvent({mediaId:deletedPost.mediaUrls,postId:deletedPost._id},"post.deleted",EXCHANGE_NAME)
            return deletedPost
        } catch (error) {
            throw DBError.create(error)
        }
    }

    private async invalidateCache(){
        try {
        const keys = await redis.keys('Posts:*')
        if(keys.length > 0){
            await redis.del(keys)
            logger.info(`Cache invalidated for ${keys.length} keys`)
        }
        } catch (error) {
            logger.error("Cache invalidation failed",error)    
        }   
    }

}