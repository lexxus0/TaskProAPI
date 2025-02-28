import {
  Controller,
  Post,
  Body,
  HttpCode,
  Put,
  UseGuards,
  Req,
  UnauthorizedException,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto, RegisterUserDto } from './auth.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { JwtAuthGuard } from '../guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/middlewares/multer';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.registerUser(registerUserDto);
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.loginUser(loginUserDto);
  }

  @Post('refresh')
  async refresh(@Body('refreshToken') refreshToken: string) {
    return await this.authService.refreshToken(refreshToken);
  }

  @Put('update')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('photo', multerConfig))
  async updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const userId = req.user?.userId;

    if (!userId) throw new UnauthorizedException('User not authenticated');

    return this.authService.updateUser(updateUserDto, req, file);
  }

  @Post('logout')
  @HttpCode(204)
  async logout() {
    return this.authService.logoutUser();
  }
}
