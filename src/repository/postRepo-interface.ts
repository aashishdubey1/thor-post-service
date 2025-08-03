import { IPost } from "../models/Post";
import { PostType } from "../schemas/Post";

export default interface IPostRepository {

    create:(data:PostType)=> Promise<IPost>,
    get:(id:string)=> Promise<IPost | null>,
    getAll:()=> Promise<IPost[]>,
    update:(id:string,data:Partial<PostType>)=>Promise<IPost | null>,
    delete:(id:string)=> Promise<IPost | null>
}