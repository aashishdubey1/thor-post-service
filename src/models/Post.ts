import mongoose, { Schema,Document } from "mongoose"

export interface IPost extends Document {
    user:Schema.Types.ObjectId,
    content:string,
    mediaUrls:string[],
}

const postSchema  = new Schema<IPost>({
    user:{
        type:Schema.Types.ObjectId,
        required:true,
        trim:true,
        ref:"User"
    },
    content:{
        type:String,
        required:true,
        trim:true,
    },
    mediaUrls:{
        type:[String],
    }
},{timestamps:true})

postSchema.index({content:"text"})

export const Post = mongoose.model<IPost>("Post",postSchema)