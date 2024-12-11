import { Controller, Post, Body, Get, Query, Req, BadRequestException } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { Request } from 'express';
import { Provider } from 'src/core/decorator/provider.decorator';
import { Public } from './../../core/decorator/public.decorator';

@Controller('analytics')
export class AnalyticsController {
    constructor(private readonly analyticsService: AnalyticsService) { }

    // Endpoint to log a visit
    @Public()
    @Post('visit')
    async logVisit(@Req() request: Request) {
        const ipAddress = request.headers['x-forwarded-for']
            ? (request.headers['x-forwarded-for'] as string).split(',')[0].trim()
            : request.socket.remoteAddress;
        const userAgent = request.headers['user-agent'] || 'Unknown';

        if (!ipAddress) {
            throw new BadRequestException('Unable to determine IP address.');
        }

        await this.analyticsService.logVisit(ipAddress, userAgent);
        return { message: 'Visit logged successfully' };
    }

    // Endpoint to get monthly visits
    @Provider()
    @Get('monthly-visits')
    async getMonthlyVisits(@Query('year') year: number) {
        if (!year) {
            throw new BadRequestException('Year query parameter is required.');
        }

        const monthlyVisits = await this.analyticsService.getMonthlyVisits(year);
        return monthlyVisits;
    }
}
