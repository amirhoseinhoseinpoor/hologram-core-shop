import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, pass: string): Promise<any> {
    const user = await this.userService.findOneByUsername(username);
    if (!(user?.password && (await bcrypt.compare(pass, user.password))))
      throw new BadRequestException('Invalid Login');

    const roles = user.userRoles?.map((r) => ({
      id: r.role?.id,
      name: r.role?.name,
    }));

    const payload = {
      id: user.id,
      username: user.username,
      domain: user.domain,
      roles: roles,
    };
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(dto: CreateUserDto): Promise<any> {
    const user = await this.userService.findOneByUsername(dto.username);
    if (user) throw new BadRequestException('Invalid Username');
    return await this.userService.create(dto);
  }
}
