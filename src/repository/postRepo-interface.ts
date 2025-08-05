import { IPost } from "../models/Post";
import { PostType } from "../schemas/Post";
import { PostSchema } from "../utils/types/PostType";

export default interface IPostRepository {

    create:(data:PostSchema)=> Promise<IPost>,
    get:(id:string)=> Promise<IPost | null>,
    getAll:(skip:number,limit:number)=> Promise<IPost[]>,
    update:(id:string,data:Partial<PostSchema>)=>Promise<IPost | null>,
    delete:(id:string)=> Promise<IPost | null>,
    countAll:()=>Promise<any>
}