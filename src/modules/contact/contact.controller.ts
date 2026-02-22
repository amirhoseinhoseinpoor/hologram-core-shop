import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { Public } from 'src/core/decorator/public.decorator';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  /**
   * Public: anyone can submit a contact message (rate-limited by IP)
   */
  @Post()
  @Public()
  create(@Body() dto: CreateContactDto, @Req() req: Request) {
    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.socket?.remoteAddress ||
      '0.0.0.0';
    return this.contactService.create(dto, ip);
  }

  /**
   * Admin only: list all contact messages
   */
  @Get('list')
  findAll() {
    return this.contactService.findAll();
  }

  /**
   * Admin only: mark as read/unread or soft-delete
   */
  @Patch(':code')
  update(@Param('code') code: string, @Body() dto: UpdateContactDto) {
    return this.contactService.update(code, dto);
  }

  /**
   * Admin only: soft-delete a message
   */
  @Delete(':code')
  deleteOne(@Param('code') code: string) {
    return this.contactService.update(code, {
      deleted: true,
    } as UpdateContactDto);
  }
}
