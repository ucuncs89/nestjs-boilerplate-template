import { randomInt } from 'crypto';
export class GenerateOtp {
  static async generateOTP() {
    let otp = '';
    const generate = randomInt(100000, 999999);
    otp = generate.toString();
    return otp;
  }
}
