import { z } from 'zod'

export const addSchema = z.object({
    title: z.string().min(8).max(255),
    description: z.string().min(8).max(1000)
})