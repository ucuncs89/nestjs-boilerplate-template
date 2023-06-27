import { randomInt } from 'crypto';
export class GenerateOtp {
  static async generateOTP() {
    let otp = '';
    const generate = randomInt(1000, 9999);
    otp = generate.toString();
    return otp;
  }
}
