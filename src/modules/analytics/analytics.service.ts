// src/modules/analytics/analytics.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Visit } from 'src/core/db/entities/visit.entity';
import dayjs from 'dayjs';
import jalaliday from 'jalaliday';

dayjs.extend(jalaliday);

@Injectable()
export class AnalyticsService {
    constructor(
        @InjectRepository(Visit)
        private readonly visitRepository: Repository<Visit>,
    ) { }

    // ثبت یک بازدید جدید
    async logVisit(ipAddress: string, userAgent: string): Promise<void> {
        const visit = this.visitRepository.create({ ipAddress, userAgent });
        await this.visitRepository.save(visit);
    }

    // دریافت تعداد بازدیدها به صورت ماهانه بر اساس تقویم شمسی
    async getMonthlyVisits(year: number): Promise<{ month: number; count: number }[]> {
        // تعیین بازه زمانی سال شمسی
        const startOfYear = dayjs().year(year).startOf('year').calendar('jalali');
        const endOfYear = dayjs().year(year).endOf('year').calendar('jalali');

        // دریافت بازدیدها در بازه زمانی مشخص شده
        const visits = await this.visitRepository
            .createQueryBuilder('visit')
            .where('visit.createdAt BETWEEN :start AND :end', {
                start: startOfYear.toDate(),
                end: endOfYear.toDate(),
            })
            .getMany();

        // شمارش بازدیدها به ازای هر ماه شمسی
        const monthlyVisits = Array.from({ length: 12 }, (_, i) => ({
            month: i + 1,
            count: 0,
        }));

        visits.forEach((visit) => {
            const jalaliDate = dayjs(visit.createdAt).calendar('jalali');
            const month = jalaliDate.month() + 1; // ماه‌ها از 0 شروع می‌شوند
            if (month >= 1 && month <= 12) {
                monthlyVisits[month - 1].count += 1;
            }
        });

        return monthlyVisits;
    }
}
