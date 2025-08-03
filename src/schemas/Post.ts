import {z} from 'zod'

export const postSchema = z.object({
    user:z.string(),
    mediaUrls:z.array(z.string()),
    content:z.string()
})

export type PostType = z.infer<typeof postSchema>
