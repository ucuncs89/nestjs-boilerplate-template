import {
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
export class AuthNeedVerifyException extends BadRequestException {
  constructor(message?: string) {
    super({
      message: 'Email belum terverifikasi',
      error_code: 'err-user-need-verif',
    });
  }
}
export class AuthNotActiveException extends BadRequestException {
  constructor(message?: string) {
    super({
      message: 'Akun belum terdaftar',
      error_code: 'err-user-not-active',
    });
  }
}
export class AuthEmailNotRegisterException extends BadRequestException {
  constructor(message?: string) {
    super({
      message: 'Email yang anda masukkan belum terdaftar',
      error_code: 'err-user-not-reg',
    });
  }
}
export class AuthWrongPassException extends UnauthorizedException {
  constructor(message?: string) {
    super({
      message: 'Kata sandi yang anda masukkan tidak cocok',
      error_code: 'err-user-wrong-psswd',
    });
  }
}

export class AuthUserExistException extends BadRequestException {
  constructor(message?: string) {
    super({
      message: 'Email yang dimasukkan sudah terdaftar',
      error_code: 'err-user-already-exists',
    });
  }
}

export class AuthVerifOTPNotFoundException extends NotFoundException {
  constructor(message?: string) {
    super({
      message: 'user tidak ditemukan',
      error_code: 'err-user-404',
    });
  }
}

export class AuthVerifOTPNotMatchException extends BadRequestException {
  constructor(message?: string) {
    super({
      message:
        'Kode yang Anda masukkin salah, silahkan periksa kembali pesan email Anda.',
      error_code: 'err-user-otp-match',
    });
  }
}

export class AuthUserActiveException extends BadRequestException {
  constructor(message?: string) {
    super({
      message: 'Akun yang dimasukkan sudah terdaftar',
      error_code: 'err-user-already-active',
    });
  }
}

export class UserUnauthorizedException extends UnauthorizedException {
  constructor(message?: string) {
    super({
      message: 'Unathorized',
      error_code: 'err-unathorized',
    });
  }
}

export class AuthPasswordSameException extends BadRequestException {
  constructor(message?: string) {
    super({
      message: 'Kata sandi sudah pernah digunakan',
      error_code: 'err-pswd-used',
    });
  }
}

export class AuthDefaultException extends BadRequestException {
  constructor(message?: string) {
    super({
      message: message || 'Error',
      error_code: 'err-default',
    });
  }
}

export class AuthIdentityCardSameException extends BadRequestException {
  constructor(message?: string) {
    super({
      message: 'NIK yang dimasukkan sudah terdaftar',
      error_code: 'err-user-already-identity',
    });
  }
}
