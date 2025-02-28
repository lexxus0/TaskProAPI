import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto, LoginUserDto } from './auth.dto';
import * as bcrypt from 'bcrypt';
import { IJwtPayload } from 'src/types/jwt-payload.interface';
import { UsersService } from 'src/users/users.service';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { saveToCloud } from 'src/utils/saveToCloud';
import { saveToDir } from 'src/utils/saveToDir';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  validateAccessToken(token: string): IJwtPayload | null {
    try {
      return this.jwtService.verify(token, {
        secret: process.env.JWT_ACCESS_SECRET,
      });
    } catch (error) {
      console.log(error);
      return null;
    }
  }

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

    const tokens = this.generateTokens(user);

    return {
      token: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        uid: user._id,
        name: user.name,
        email: user.email,
      },
    };
  }

  async updateUser(
    updateUserDto: UpdateUserDto,
    req: any,
    file: Express.Multer.File,
  ) {
    const userId = req.user?.userId;
    let url;

    if (file) {
      if (process.env.ENABLE_CLOUDINARY === 'true') {
        url = await saveToCloud(file);
      } else {
        url = await saveToDir(file);
      }
    }

    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const updatedUser = await this.usersService.update(userId, updateUserDto);

    if (url) {
      updatedUser.profilePic = url;
    }

    if (!updatedUser) {
      throw new UnauthorizedException('Unable to update user details');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...user } = updatedUser.toObject();
    return user;
  }

  async refreshToken(oldRefreshToken: string) {
    try {
      const decoded = this.jwtService.verify(oldRefreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const { accessToken, refreshToken } = this.generateTokens(decoded);
      return { accessToken, refreshToken };
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  private generateTokens(user: any) {
    const jwtPayload: IJwtPayload = {
      email: user.email,
      userId: user._id.toString(),
    };

    const accessToken = this.jwtService.sign(jwtPayload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(jwtPayload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '30d',
    });

    return { accessToken, refreshToken };
  }

  logoutUser() {
    return { message: 'Successfully logged out' };
  }
}
