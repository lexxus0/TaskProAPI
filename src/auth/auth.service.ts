import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from './auth.dto';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './auth.dto';
import { IJwtPayload } from 'src/types/jwt-payload.interface';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async registerUser(registerUserDto: RegisterUserDto) {
    const { name, email, password } = registerUserDto;
    const isUser = await this.usersService.findByEmail(email);
    if (isUser) throw new ConflictException('Email is already in use');

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await this.usersService.create({
      name,
      email,
      password: hashedPassword,
    });

    const userData = { ...newUser.toObject() };
    delete userData.password;
    return userData;
  }

  async loginUser(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('User not found');

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch)
      throw new UnauthorizedException('Your email or password is incorrect');

    const jwtPayload: IJwtPayload = {
      email: user.email,
      userId: user._id as string,
    };
    const accessToken = this.jwtService.sign(jwtPayload);

    return { accessToken };
  }

  logoutUser() {
    return { message: 'Sussessfully logged out' };
  }
}
