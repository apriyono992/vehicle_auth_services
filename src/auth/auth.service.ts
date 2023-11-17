import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as interfaces from './dto/interface';
import { hashPassword } from '../helper/hash_password';
import { NotFoundError } from 'rxjs';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    @Inject(
      forwardRef(() => {
        return UserService;
      }),
    )
    private userServices: UserService,
    private jwtServices: JwtService,
  ) {}

  async login(login: interfaces.Login) {
    try {
      const user = await this.userServices.findOneByEmail(login.email);
      if (!user) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Your account is not active',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      console.log(login.password);
      console.log(user);
      console.log(await hashPassword(login.password, user.salt));
      if (user.password !== (await hashPassword(login.password, user.salt))) {
        if (!user) {
          throw new NotFoundException('Incorect Password');
        }
      }
      const payload = {
        email: user.email,
        name: user.name,
        sub: user.id,
        identityNumber: user.identityNumber,
      };

      return {
        name: user.name,
        access_token: this.jwtServices.sign(payload, {
          secret: jwtConstants.secret,
        }),
      };
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'User not found',
          },
          HttpStatus.NOT_FOUND,
        );
      } else {
        throw error;
      }
    }
  }

  async validateUser(validate: interfaces.Login) {
    const user = await this.userServices.findOneByEmail(validate.email);

    if (
      user &&
      user.password === (await hashPassword(validate.password, user.salt))
    ) {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        identityNumber: user.identityNumber,
      };
    }
    return null;
  }
}
