import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import * as bcrypt from 'bcrypt';

@Injectable()

export class AuthService {
  private solt_rounds = 12;
  constructor(private readonly prisma:PrismaService){}

  async register(registerDto: RegisterDto):Promise<AuthResponseDto> {
    const {email, password, firstName, lastName} = registerDto;

    const userExist = await this.prisma.user.findUnique({
      where:{
        email
      }
    })
  if(userExist){
    throw new BadRequestException('User already exist');
  }

  const hashedPassword = await bcrypt.hash(password, this.solt_rounds);


    const user =await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName
      },
      select: {
        id:true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        password: false
      }
    })
    return {
      accessToken: '',  
      refreshToken: '',
      user
    }
  }



}
