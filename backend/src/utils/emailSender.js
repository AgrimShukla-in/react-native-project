// File: services/sendResendEmail.js
import {Resend} from 'resend';
import { generateEmailTemplate } from './emailTemplate.js';

 // Adjust the path as needed

const resend = new Resend(process.env.RE_SEND_API_KYE);


async function sendResendEmail(email, type, code, userName = '') {
  const { subject, html } = generateEmailTemplate(type, code, userName);

  try {
    const response = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>', 
      to: email,
      subject,
      html,
    });
    console.log('Email sent successfully:', response);

    return {
      success: true,
      messageId: response?.id || null,
      email,
    };
  } catch (error) {
    console.error('Error sending email via Resend:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

export default sendResendEmail;
