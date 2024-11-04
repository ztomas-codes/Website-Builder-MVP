import {EmailTemplate} from "@/features/api/mailer/sendEmail";


export type Props = {
    firstName: string;
    newPassword: string;
}

export const accountResetPasswordEmailTemplate = (props : Props) : EmailTemplate => {
    const template : EmailTemplate = {
        subject: "Vaše nové heslo k účtu TidyTime",
        text:
        `
        Vážený/á ${props.firstName},
        
        na základě Vaší žádosti jsme vygenerovali nové heslo k Vašemu účtu TidyTime. Níže naleznete Vaše nové přihlašovací údaje:
        
        Nové heslo: <strong>${props.newPassword}</strong>
        
        Doporučujeme, abyste si po přihlášení změnil/a toto heslo na něco snadno zapamatovatelného, ale zároveň dostatečně bezpečného. Pro změnu hesla se prosím přihlaste do svého účtu a přejděte do nastavení účtu.
        
        Pokud máte jakékoli další dotazy nebo potřebujete pomoc, neváhejte nás kontaktovat na tidytime@ztomas.eu.
        
        Děkujeme, že používáte TidyTime!
        
        S přátelským pozdravem,
        
        Tým TidyTime
        `
    }
    return template;
}