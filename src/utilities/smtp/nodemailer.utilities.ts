import nodemailer from "nodemailer";
import { GMAIL_USER, GMAIL_PASSWORD } from '../../configurations/envKeys';

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: `${GMAIL_USER}`,
    pass: `${GMAIL_PASSWORD}`,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

//message, subject, actionLink, actionText : "PLEASE VERIFY YOUR ACCOUNT" ${process.env.APP_BASE_URL}/${token}

// const sendMail = async (to: string, message:string, subject:string, actionLink?: any, actionText?:any) => {
//     try {
//       const response = await transport.sendMail({
//         from: `${process.env.GMAIL_USER}`,
//         to,
//         subject,
//         html: `<div width="50%" style="text-align: center; padding: 25px; border-radius: 5px; border: 2px solid #27AE60;">
//               <h1>Welcome to Made In Naija Stores</h1>
//               <p style="margin-bottom: 10px">Click the button below to verify your account</p>
//               <br />
//               ${actionLink ? `<a href="${actionLink}" style="text-decoration: none; color: white; display: inline-block; background-color: #27AE60; padding: 10px 20px; border-radius: 10px;">${actionText}</a>` : ""}
//               </div>`
//       });
//     } catch (err: any) {
//       console.log(err.message);
//     }
//   };


const sendMail = async (
  to: string, 
  message: string, 
  subject: string, 
  actionLink: string = '', 
  actionText: string = 'Click here'
) => {
  try {
    const mailOptions = {
      from: `${GMAIL_USER}`,
      to,
      subject,
      html: `<div style="text-align: center; padding: 25px; border-radius: 5px; border: 2px solid #27AE60;">
              <h1>Welcome to Made In Naija Stores</h1>
              <p>${message}</p>
              ${actionLink ? `<a href="${actionLink}" style="text-decoration: none; color: white; display: inline-block; background-color: #27AE60; padding: 10px 20px; border-radius: 10px;">${actionText}</a>` : ""}
             </div>`,
    };

    const response = await transport.sendMail(mailOptions);
    return response;
  } catch (err: any) {
    console.error('Error sending email:', err.message);
    throw new Error(err.message);
  }
};



  export default {
    sendMail
  }