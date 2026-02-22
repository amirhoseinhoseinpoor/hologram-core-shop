import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Contact } from 'src/core/db/entities/contact.entity';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { ContactRepository } from './contact.repository';
import { OK, genUID } from 'src/core/misc/consts';

@Injectable()
export class ContactService {
  constructor(private repo: ContactRepository) {}

  async create(dto: CreateContactDto, ip: string) {
    // Rate limit: max 2 messages per IP per day
    const todayCount = await this.repo.countByIpToday(ip);
    if (todayCount >= 2) {
      throw new BadRequestException(
        'شما امروز بیش از حد مجاز پیام ارسال کرده‌اید. لطفاً فردا مجدداً تلاش کنید.',
      );
    }

    const code = genUID();
    await this.repo.createOrUpdate({
      ...dto,
      code,
      ip,
      isRead: false,
      deleted: false,
    } as Contact);

    return { code, ...OK };
  }

  async findAll() {
    const contacts = await this.repo.findAll();
    if (!contacts?.length) return [];

    return contacts
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .map((c) => ({
        code: c.code,
        name: c.name,
        phone: c.phone,
        message: c.message,
        isRead: c.isRead,
        ip: c.ip,
        date: c.createdAt,
      }));
  }

  async update(code: string, dto: UpdateContactDto) {
    const contact = await this.repo.findOne({ code });
    if (!contact) throw new NotFoundException('Contact not found');
    Object.assign(contact, dto);
    await this.repo.createOrUpdate({ ...contact, code } as Contact);
    return OK;
  }
}
