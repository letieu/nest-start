import { BaseEntity, Repository } from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { IPaginationOptions, Pagination, paginate } from "nestjs-typeorm-paginate";

export class BaseService<Entity extends BaseEntity> {
  constructor(public repository: Repository<Entity>) {
    this.repository = repository;
  }

  async create(dto: any) {
    return this.repository.save(dto);
  }

  findAll(query = {}) {
    return this.repository.find(query);
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<Entity>> {
    return paginate<Entity>(this.repository, options);
  }

  async findOne(where) {
    return this.repository.findOneBy(where);
  }

  update(id: number, dto: any) {
    return this.repository.save({ id, ...dto });
  }

  remove(id: number) {
    return this.repository.delete(id);
  }
}
