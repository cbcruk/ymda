import { z } from 'zod'

export const storySchema = z.object({
  id: z.number(),
  title: z.string(),
  keywords: z
    .string()
    .transform((v): z.infer<z.ZodArray<z.ZodString>> => JSON.parse(v)),
  size: z.number(),
  summary: z.string(),
  body: z.string(),
  author: z.string(),
  tags: z
    .string()
    .transform((v): z.infer<z.ZodArray<z.ZodString>> => JSON.parse(v)),
})

export type StorySchema = z.infer<typeof storySchema>

export const storyListSchema = z.array(storySchema)

export const tagSchema = z.object({
  category: z.string(),
  tag_group: z.string(),
  tag: z.string(),
})

export type TagSchema = z.infer<typeof tagSchema>
