import { z } from "zod"

export const collectionFormSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(2),
  keywordsFacility: z.string().min(2),
})
