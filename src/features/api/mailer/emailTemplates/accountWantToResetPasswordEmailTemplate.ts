import {EmailTemplate} from "@/features/api/mailer/sendEmail";
import {createEmailButton} from "@/features/api/mailer/createEmailButton";


export type Props = {
    firstName: string;
    email: string;
    token: string;
}

export const accountWantToResetPasswordEmailTemplate = (props : Props) : EmailTemplate => {
    const template : EmailTemplate = {
        subject: "Resetování hesla k aplikaci TidyTime",
        text:
        `
        Vážený/á ${props.firstName},
        
        zdá se, že jste zapomněl/a své heslo k účtu TidyTime. Nebojte se, jsme tu, abychom Vám pomohli!
        
        Pro obnovení Vašeho hesla prosím klikněte na následující odkaz:
        
        ${createEmailButton("Obnovit heslo", "https://tidytime.ztomas.eu/api/account/forgotPassword?token=" + props.token)}
        
        Tento odkaz je platný po dobu 24 hodin. Pokud neobnovíte své heslo v tomto časovém rámci, budete muset požádat o nový odkaz.
        
        Pokud jste nežádal/a o obnovení hesla, můžete tento e-mail ignorovat. Vaše heslo zůstane nezměněné a Váš účet bude nadále bezpečný.
        
        Pokud máte jakékoli další dotazy nebo potřebujete pomoc, neváhejte nás kontaktovat na tidytime@ztomas.eu.
        
        Děkujeme, že používáte TidyTime!
        
        S přátelským pozdravem,
        Tým TidyTime
        `
    }
    return template;
}