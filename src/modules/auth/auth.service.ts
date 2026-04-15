import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()

export class AuthService {
  private solt_rounds = 12;
  constructor(
    private readonly prisma:PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService

  ){}

  // Register function
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

 try{
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

    const tokens = await this.generateTokens(user.id, user.email);
      await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      ...tokens,
      user
    }
 } catch (error) {
   console.log(error, "User registration error");
   throw new InternalServerErrorException("User registration error");
 }
  }
  
  // Generate access and refresh tokens
  private async generateTokens(userId: string, email: string):Promise<{accessToken: string, refreshToken: string}> {
    const payload = {sub:userId, email};
    const refreshId = randomBytes(16).toString('hex');

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '15m'
      }),
      this.jwtService.signAsync({...payload, refreshId}, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d'
      })
    ])

    return {
      accessToken,
      refreshToken
    }
  }

// Update refresh token in the database
async updateRefreshToken(userId: string, refreshToken: string):Promise<void> {
  await this.prisma.user.update({
    where: {
      id: userId
    },
    data: {
      refreshToken
    }
  })
}

}
