import {prisma} from "../../../../prisma/prisma";

export const removeActionToken = async (token: string) => {
    const actionToken = await prisma.app_user_actions_tokens.delete({
        where: {
            token: token
        }
    })
}