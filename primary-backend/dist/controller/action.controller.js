import { prisma } from "../lib/prisma.js";
export const getAvailableActions = async (req, res) => {
    try {
        const availableActions = await prisma.availableAction.findMany();
        if (!availableActions) {
            return res.status(404).json({
                message: "Unable to find available actions"
            });
        }
        return res.status(200).json({
            message: "Available actions found",
            availableActions
        });
    }
    catch (err) {
        console.error("[AVAILABLE ACTIONS FETCH ERROR]");
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};
