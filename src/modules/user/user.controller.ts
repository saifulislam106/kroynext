import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import type { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';
import { UserResponseDto } from './dto/user-response.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { ChangePasswordDto } from './dto/change-password.dto';

@ApiTags('users')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}



  @Get('me')
  async getProfile(@Req() req: RequestWithUser): Promise<UserResponseDto> {
    return this.userService.getProfile(req.user.id);
  }

  @Get()
  @Roles(Role.ADMIN)
  async findAll(): Promise<UserResponseDto[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    return await this.userService.findOne(id);
  }

  @Patch('me')
  async updateProfile(@GetUser('id') userId: string, @Body() updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    return this.userService.updateProfile(userId, updateUserDto);
  }
  @Patch('me/password')
  async changePassword(@GetUser('id') userId: string, @Body() changePasswordDto: ChangePasswordDto): Promise<{message: string}> {
    return await this.userService.changePassword(userId, changePasswordDto);
  }

  @Delete('me')
  async removeProfile(@GetUser('id') userId: string): Promise<{message: string}> {
    return await this.userService.remove(userId);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  async remove(@Param('id') id: string):Promise<{message: string}> {
    return await this.userService.remove(id);
  }
}
