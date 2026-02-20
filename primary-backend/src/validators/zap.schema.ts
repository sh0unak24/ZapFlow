import z from "zod";

export const ZapCreateSchema = z.object({
    avaialbleTriggerId : z.string(),
    triggerMetadata : z.any().optional(),
    actions : z.array(z.object({
       availableActionId : z.string(),
       actionName : z.string(),
       actionMetadata : z.any().optional()
    }))
})

