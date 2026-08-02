import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { OtpRepository } from './otp.repository';
import { OtpCode } from 'src/core/db/entities/otp-codes.entity';

@Injectable()
export class OtpService {
    constructor(private otpRepository: OtpRepository) { }

    private generateOtp(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }



    async createOtp(
        username: string,
        type: 'login' | 'register',
    ): Promise<string> {

        const oldOtp = await this.otpRepository.findOne({
            username,
            type,
        });

        if (
            oldOtp &&
            oldOtp.createdAt.getTime() + 60 * 1000 > Date.now()
        ) {
            throw new BadRequestException(
                'Please wait before requesting another OTP.',
            );
        }


        // Delete previous OTPs for this user/type
        await this.otpRepository.delete({
            username,
            type,
        });

        // Delete expired OTPs
        await this.otpRepository.deleteExpired();

        const otp = this.generateOtp();
        console.log(otp);
        

        const otpEntity = new OtpCode();
        otpEntity.username = username;
        otpEntity.type = type;

        // Store hashed OTP
        otpEntity.code = await bcrypt.hash(otp, 10);

        otpEntity.expiresAt = new Date(Date.now() + 8 * 60 * 1000);

        await this.otpRepository.createOrUpdate(otpEntity);

        return otp;
    }

    async verifyOtp(
        username: string,
        otp: string,
        type: 'login' | 'register',
    ): Promise<boolean> {
        const storedOtp = await this.otpRepository.findOne({
            username,
            type,
        });

        if (!storedOtp) {
            return false;
        }

        if (storedOtp.expiresAt.getTime() < Date.now()) {
            await this.otpRepository.delete({
                id: storedOtp.id,
            });

            return false;
        }

        const valid = await bcrypt.compare(otp, storedOtp.code);

        if (!valid) {
            return false;
        }

        await this.otpRepository.delete({
            id: storedOtp.id,
        });

        return true;
    }


}