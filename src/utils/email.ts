import axios from 'axios';
import { env } from 'process';
import { AppErrorException } from 'src/exceptions/app-exception';
type Data = {
  data: any;
};
export class Email {
  static async SendEmail(payload) {
    try {
      const { data } = await axios.post<Data>(
        'https://api.brevo.com/v3/smtp/email',
        payload,
        {
          headers: {
            'api-key': env.SENDINBLUE_API_KEY,
          },
        },
      );
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new AppErrorException(error.message);
      } else {
        throw new AppErrorException('An unexpected error occurred');
      }
    }
  }
  static async sendEmailRegister(data) {
    const { email, full_name, html, subject } = data;
    const payload = {
      sender: {
        name: env.SENDINBLUE_SENDER_NAME,
        email: env.SENDINBLUE_SENDER_EMAIL,
      },
      to: [
        {
          email,
          name: full_name,
        },
      ],
      subject: subject || 'Verification Code',
      htmlContent: html,
    };

    const send = this.SendEmail(payload)
      .then((v) => v)
      .catch((e) => new Error(e));
    return send;
  }

  static async sendEmailForgot(data) {
    const { email, full_name, otp } = data;
    const payload = {
      sender: {
        name: env.SENDINBLUE_SENDER_NAME,
        email: env.SENDINBLUE_SENDER_EMAIL,
      },
      to: [
        {
          email,
          name: full_name,
        },
      ],
      subject: 'Verification Code - Forgot Password ',
      htmlContent: otp,
    };
    const send = this.SendEmail(payload)
      .then((v) => v)
      .catch((e) => new Error(e));
    return send;
  }
}
