import nodemailer from "nodemailer";
export class EmailSender{
    static sendEmail=async(to, subject, body)=>{
        const transport=nodemailer.createTransport({
            service:"gmail",
            auth:{
                user:"osama1111222@gmail.com",
                pass:"digc gomo ffan ensj"
            }
        })

        await transport.sendMail({
            from:'"HealthPal" <osama1111222@gmail.com>',
            to,
            subject,
            html:body
        })
    }


}

export default EmailSender;