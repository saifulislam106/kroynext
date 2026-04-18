import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CategoryResponseDto } from './dto/response-category.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { QueryCategoryDto } from './dto/query-category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('create')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async create(@Body() createCategoryDto: CreateCategoryDto): Promise<CategoryResponseDto> {
    return await this.categoryService.create(createCategoryDto);
  }

  @Get()
  async findAll(@Query() queryCategory: QueryCategoryDto) {
    return await this.categoryService.findAll(queryCategory);
  }

  @Get(':id')
  async findOne(@Param('id') id: string):Promise<CategoryResponseDto> {
    return await this.categoryService.findOne(id);
  }
  
  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string):Promise<CategoryResponseDto> {
    return await this.categoryService.findBySlug(slug);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto): Promise<CategoryResponseDto> {
    return await this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  async remove(@Param('id') id: string): Promise<{message: string}> {
    return await this.categoryService.remove(id);
  }
}
