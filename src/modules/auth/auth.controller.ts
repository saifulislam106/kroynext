import { RegisterDto } from './dto/register.dto';
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async RegisterDto(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return await this.authService.register(registerDto);
  }

  @Post('refresh')
  @UseGuards(RefreshTokenGuard)
  @ApiBearerAuth('JWT-refresh')
  async refreshToken(@GetUser('id') userId: string): Promise<AuthResponseDto> {
    return await this.authService.refreshToken(userId);
  }

  @Post('logout')
  // @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  async logout(@GetUser('id') userId: string): Promise<{message: string}> {
    console.log("userId", userId)
    await this.authService.logout(userId);
    return { message: 'Logout successful' };
  }

  @Post('login')
  async login(@GetUser('id') @Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return await this.authService.login(loginDto);
  }

}
