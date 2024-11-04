import {prisma} from "../../../../prisma/prisma";

export const getActionToken = async (token: string) => {
    const actionToken = await prisma.app_user_actions_tokens.findFirst({
        where: {
            token: token
        },
        select: {
            type: true,
            expiration: true,
            token: true,
            app_user: true
        }
    })

    return actionToken;
}