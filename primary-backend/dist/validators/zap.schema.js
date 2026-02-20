import z from "zod";
export const ZapCreateSchema = z.object({
    availableTriggerId: z.string(),
    triggerMetadata: z.any().optional(),
    actions: z.array(z.object({
        availableActionId: z.string(),
        actionName: z.string(),
        actionMetadata: z.any().optional()
    }))
});
