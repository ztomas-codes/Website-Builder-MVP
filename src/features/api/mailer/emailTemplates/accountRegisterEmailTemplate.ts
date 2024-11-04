import {EmailTemplate} from "@/features/api/mailer/sendEmail";


export type Props = {
    firstName: string;
}

export const accountRegisterEmailTemplate = (props : Props) : EmailTemplate => {
    const template : EmailTemplate = {
        subject: " Děkujeme za registraci na TidyTime!",
        text:
        `
        Vážený/á ${props.firstName},

        děkujeme za Vaši registraci na naší aplikaci TidyTime! Jsme rádi, že jste se rozhodl/a připojit k naší komunitě,
        která se zaměřuje na efektivní správu času a úkolů.
        
        
        Pokud máte jakékoli dotazy nebo potřebujete pomoc, neváhejte nás kontaktovat na tidytime@ztomas.eu.
        
        Těšíme se na spolupráci a věříme, že Vám TidyTime pomůže dosáhnout Vašich cílů.
        
        S přátelským pozdravem,
        Tým TidyTime
        `
    }
    return template;
}