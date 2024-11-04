import {EmailTemplate} from "@/features/api/mailer/sendEmail";


export type Props = {
    code: string;
    discount: number;
    expiration: Date;
}

export const subscriptionEmailTemplate = (props : Props) : EmailTemplate => {
    const template : EmailTemplate = {
        subject: "Děkujeme za odběr !",
        text:
        `
        Děkujeme, že jste se přihlásil/a k odběru našeho newsletteru TidyTime! Jsme nadšeni,
        že s Vámi můžeme sdílet naše nejnovější tipy a triky na efektivní správu času a úkolů.
        Tým TidyTime
        
        Jak jsme slíbili, zde je jednorázový kód pro <strong>${props.discount}%</strong> slevu: <strong> ${props.code.toUpperCase()}</strong>.
        Využijte jej při svém dalším nákupu nebo při aktivaci prémiových funkcí naší aplikace.
        Kupón je platný do <strong>${props.expiration.toLocaleDateString()}!!.</strong>
        
        S přátelským pozdravem,
        Tým TidyTime
        `
    }
    return template;
}