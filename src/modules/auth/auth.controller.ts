import { RegisterDto } from './dto/register.dto';
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  RegisterDto(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

}
