import {z} from 'zod'

export const postSchema = z.object({
    mediaUrls:z.array(z.string()).optional(),
    content:z.string()
})

export type PostType = z.infer<typeof postSchema>
