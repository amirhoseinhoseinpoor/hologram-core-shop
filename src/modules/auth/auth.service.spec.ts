import { BadRequestException } from '@nestjs/common';
import axios from 'axios';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { OtpService } from '../otp/otp.service';

jest.mock('axios');

const USERNAME = '09120000000';
const OTHER_USERNAME = '09120000001';

function fakeOtpRepository() {
  const rows: any[] = [];
  return {
    rows,
    findOne: jest.fn(
      async (where) =>
        rows.find((r) =>
          Object.keys(where).every((k) => r[k] === where[k]),
        ) ?? null,
    ),
    delete: jest.fn(async (where) => {
      for (let i = rows.length - 1; i >= 0; i--) {
        if (Object.keys(where).every((k) => rows[i][k] === where[k])) {
          rows.splice(i, 1);
        }
      }
    }),
    deleteExpired: jest.fn(async () => undefined),
    createOrUpdate: jest.fn(async (otp) => {
      rows.push({ ...otp, id: rows.length + 1, createdAt: new Date(0) });
      return otp;
    }),
  };
}

describe('AuthService login', () => {
  let service: AuthService;
  let users: any;
  let jwt: any;
  let otpRepo: ReturnType<typeof fakeOtpRepository>;

  const sentOtp = () =>
    (axios.post as jest.Mock).mock.calls.at(-1)[1].parameters[0].value;

  beforeEach(async () => {
    (axios.post as jest.Mock).mockReset().mockResolvedValue({});
    const password = await bcrypt.hash('1234', 4);
    const known = {
      id: 1,
      code: 'U1',
      username: USERNAME,
      password,
      domain: 1,
      firstName: 'a',
      lastName: 'b',
      userRoles: [],
    };
    users = {
      findOneByUsername: jest.fn(async (u) => (u === USERNAME ? known : null)),
      update: jest.fn(async () => ({ ok: true })),
    };
    jwt = { signAsync: jest.fn(async () => 'jwt') };
    otpRepo = fakeOtpRepository();
    service = new AuthService(
      users,
      jwt,
      new OtpService(otpRepo as any),
    );
  });

  it('never issues a token for the password step alone', async () => {
    const result = await service.signIn(USERNAME, '1234');

    expect(result.token).toBeUndefined();
    expect(jwt.signAsync).not.toHaveBeenCalled();
    expect(axios.post).toHaveBeenCalledTimes(1);
  });

  it('sends no OTP when the password is wrong', async () => {
    await expect(service.signIn(USERNAME, 'nope')).rejects.toThrow(
      BadRequestException,
    );
    expect(axios.post).not.toHaveBeenCalled();
  });

  it('logs in with password then OTP, with a long-lived token', async () => {
    await service.signIn(USERNAME, '1234');
    const result = await service.signInOtp(USERNAME, sentOtp());

    expect(result.token).toBe('jwt');
    expect(jwt.signAsync.mock.calls[0][1]).toEqual({ expiresIn: '7d' });
  });

  it('refuses login OTPs from the public send-otp route', async () => {
    await expect(service.sendOtp(USERNAME, 'login')).rejects.toThrow(
      BadRequestException,
    );
    expect(axios.post).not.toHaveBeenCalled();
  });

  it('burns the code after 5 wrong guesses', async () => {
    await service.signIn(USERNAME, '1234');
    const otp = sentOtp();
    const wrong = otp === '100000' ? '100001' : '100000';

    for (let i = 0; i < 5; i++) {
      await expect(service.signInOtp(USERNAME, wrong)).rejects.toThrow(
        'Invalid OTP',
      );
    }

    await expect(service.signInOtp(USERNAME, otp)).rejects.toThrow(
      'Invalid OTP',
    );
  });

  it('does not accept a reset code for login', async () => {
    await service.forgotPassword(USERNAME);

    await expect(service.signInOtp(USERNAME, sentOtp())).rejects.toThrow(
      'Invalid OTP',
    );
  });

  it('answers forgot-password the same for unknown numbers, sending nothing', async () => {
    const known = await service.forgotPassword(USERNAME);
    (axios.post as jest.Mock).mockClear();
    const unknown = await service.forgotPassword(OTHER_USERNAME);

    expect(unknown).toEqual(known);
    expect(axios.post).not.toHaveBeenCalled();
  });

  it('changes the password only with a valid reset code', async () => {
    await service.forgotPassword(USERNAME);
    const otp = sentOtp();
    const wrong = otp === '100000' ? '100001' : '100000';

    await expect(
      service.resetPassword(USERNAME, wrong, '5678'),
    ).rejects.toThrow('Invalid OTP');
    expect(users.update).not.toHaveBeenCalled();

    await service.resetPassword(USERNAME, otp, '5678');
    expect(users.update).toHaveBeenCalledWith('U1', { password: '5678' });
  });
});
