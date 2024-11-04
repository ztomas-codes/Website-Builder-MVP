export type EmailTemplate = {
    subject: string;
    text: string;
}

export const sendEmail = async (template: EmailTemplate, to : string) => {

    var {subject, text} = template;

    text = text.replace(/\n/g, "<br>");

    const nodemailer = require("nodemailer");
    const transporter = nodemailer.createTransport({
        host: "smtp.seznam.cz",
        port: 465,
        secure: true,
        auth: {
            user: "tidytime@ztomas.eu",
            pass: "Uk$F$f@wp$is33Y",
        },
    });
    const info = await transporter.sendMail({
        from: '"TidyTime Aplikace" <tidytime@ztomas.eu>',
        to: to,
        subject: subject,
        html:
        `
        <html>
            <head>
                <style>
                    strong
                    {
                        color: #65399f;
                    }
                    .wrapper {
                        font-family: Arial, sans-serif;
                        background: #151515;
                        padding: 30px;
                    }
                    .logo {
                        width: 100px;
                        height: 100px;
                        border-radius: 32px
                    }
                    .inText{
                        color: #676767;
                        line-height: 30px;
                    }
                    table
                    {
                        margin-top: 15px;
                        margin-bottom: 15px;
                    }
                    td {
                        border-radius: 5px;
                    }
                    
                    td a {
                        padding: 20px 20px;
                        font-family: Arial, Helvetica, sans-serif;
                        font-size: 20px;
                        color: #ffffff; 
                        text-decoration: none;
                        font-weight: bold;
                        display: inline-block;  
                    }
                    a
                    {
                        text-decoration: none !important;
                        color: #ffffff !important; 
                    }
                </style>
            </head>
        </html>
        <body>
            <div class="wrapper">
                <img src="https://tidytime.ztomas.eu/logo.jpg" alt="TidyTime logo" class="logo">
                <h1 style="color: #fff;">TidyTime</h1>
                <div class="inText">
                    ${text}
                </div>
                <br>
                <a href="https://tidytime.ztomas.eu" style="color: white">© ${new Date().getFullYear()} TidyTime</a>
            </div>
        </body>
        `
    });

    return info;
}

