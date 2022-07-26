import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  DefaultValuePipe,
  Get, HttpException,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { UpdateUserDto } from './dto/update-user.dto';
import { Jwt2faAuthGuard } from '../../auth/guards/jwt-2fa-auth.guard';
import { UserDecorator } from '../../auth/decorators/user.decorator';

@ApiTags('users')
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ): Promise<Pagination<User>> {
    return this.userService.paginate({ page, limit });
  }

  @ApiBearerAuth()
  @UseGuards(Jwt2faAuthGuard)
  @Patch('/:id')
  updateProfile(
    @Param('id') id: string,
    @Body() userDto: UpdateUserDto,
    @UserDecorator() authUser: User,
  ): Promise<User> {
    if (authUser.id !== +id) {
      throw new HttpException('Unauthorized', 401);
    }
    return this.userService.updateProfile(+id, userDto);
  }
}
