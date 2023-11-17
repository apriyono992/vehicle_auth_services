import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import * as interfaces from './dto/interface';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authServices: AuthService) {}
  @Post('login')
  async login(@Body() loginUserDto: interfaces.Login) {
    try {
      return {
        status: HttpStatus.OK,
        message: 'Login Successful',
        data: await this.authServices.login(loginUserDto),
      };
    } catch (error) {
      return error;
    }
  }
}
