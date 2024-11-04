import {prisma} from "../../../../prisma/prisma";

type Props = {
    discount: number;
    expiration: Date;
}

export const generateDiscountCode = async (props : Props) => {
    const randomString = Math.random().toString(36).substring(2, 8);

    await prisma.app_coupons.create({
        data: {
            code: randomString,
            discount: props.discount,
            type: "subscriptionEmailReward",
            expiration: props.expiration
        }
    })

    return randomString;
}