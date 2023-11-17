import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.model';
import { AuthGuard } from '../auth/auth_guards';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: User) {
    return this.userService.create(createUserDto);
  }
  @UseGuards(AuthGuard)
  @UseInterceptors(CacheInterceptor)
  @Get()
  @CacheTTL(30)
  findAll() {
    return this.userService.findAll();
  }
  @UseGuards(AuthGuard)
  // @UseInterceptors(CacheInterceptor)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.userService.getOne(id);
  }
  @UseGuards(AuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: User) {
    return this.userService.update(id, updateUserDto);
  }
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
