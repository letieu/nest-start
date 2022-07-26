import { Injectable } from '@nestjs/common';
import { BaseService } from '../../database/base.service';
import { Email } from './entities/email.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateEmailDto } from './dto/create-email.dto';

@Injectable()
export class EmailService extends BaseService<Email> {
  constructor(
    @InjectRepository(Email)
    private emailRepository: Repository<Email>,
  ) {
    super(emailRepository);
  }

  async createOrUpdate(emailDto: CreateEmailDto) {
    const email = await this.repository.findOne({
      where: {
        email: emailDto.email,
      },
    });
    if (email) {
      await this.repository.update(email.id, emailDto);
      return email;
    }
    return this.repository.save(emailDto);
  }
}
