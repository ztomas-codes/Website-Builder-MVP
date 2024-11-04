import {prisma} from "../../../../prisma/prisma";

export const createActionToken = async (userId : number, actionType : string, expiration : Date) => {
    const actionToken = await prisma.app_user_actions_tokens.create({
        data: {
            type: actionType,
            user_id: userId,
            expiration: expiration,
            token: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
        }
    })

    // @ts-ignore
    return actionToken.token;
}