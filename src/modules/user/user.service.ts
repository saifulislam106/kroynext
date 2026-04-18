import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private solt_rounds = 12 ;
  constructor(private readonly prisma: PrismaService) {}
 async getProfile(userId: string): Promise<UserResponseDto> {
   const user = await this.prisma.user.findUniqueOrThrow({
     where: {
       id: userId
     },
     select: {
       id: true,
       email: true,
       role: true,
       firstName: true,
       lastName: true,
       createdAt: true,
       updatedAt: true,
     }
   });

   if (!user) {
     throw new NotFoundException('User not found');
   }

   return user;
 }

  async findAll(): Promise<UserResponseDto[]> {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string): Promise<UserResponseDto> {
    return await this.prisma.user.findUniqueOrThrow({
      where: {
        id,
      },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async updateProfile(userId: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if(updateUserDto.email && user.email !== updateUserDto.email) {
      const userExist = await this.prisma.user.findUnique({
        where: {
          email: updateUserDto.email,
        },
      });
      if (userExist) {
        throw new NotFoundException('User already exist');
      }
    }

    const updatedUser = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data:updateUserDto,
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        updatedAt: true,
      },
    })
    return updatedUser;
  }
  async changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<{message: string}> {
    const {currentPassword, newPassword}= changePasswordDto;
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

      const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new NotFoundException('Current password is incorrect');
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      throw new NotFoundException('New password must not be same as current password');
    }

    const hashedPassword = await bcrypt.hash(newPassword, this.solt_rounds);
    
    const updatedUser = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data:{
        password: hashedPassword
      }
    })
    return {message: 'Password changed successfully'};
  }


 async remove(userId: string): Promise<{message: string}> {
  const user = await this.prisma.user.findUnique({
    where: {
      id: userId,
    },
  })
  if(!user) {
    throw new NotFoundException('User not found');
  }
    await this.prisma.user.delete({
      where: {
        id: userId,
      },
    });
    return {message: 'User deleted successfully'};
  }
}
