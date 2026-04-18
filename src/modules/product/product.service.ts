import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductResponseDto } from './dto/product-response.dto';
import { Category, Prisma, Product } from '@prisma/client';
import { QueryProductDto } from './dto/query-product.dto';

@Injectable()
export class ProductService {

  constructor(private readonly prisma : PrismaService) {}
  async create(createProductDto: CreateProductDto):Promise<ProductResponseDto> {
    const {price, sku, ...rest}= createProductDto;

    const productExits = await this.prisma.product.findUnique({where: {sku: sku}});
    if(productExits) {
      throw new ConflictException('Product with this sku already exists');
    }
    const product = await this.prisma.product.create({
      data: { sku, ...rest, price: new Prisma.Decimal(price)},
      include: {category: true}
    });
    return this.formatProduct(product);
  }

  async findAll(queryDto: QueryProductDto): Promise<{data:ProductResponseDto[], meta:{
    total: number,
    page: number,
    limit: number,
    totalPage: number
  }}> {                               
    const {category, isActive, search, page=1, limit=10} = queryDto;

    
    const where: Prisma.ProductWhereInput = {};

    if(isActive !== undefined) {
      where.isActive = isActive;
    }

    if(category) {
      where.categoryId = category;
    }

    if(search) {
      where.OR = [
        {name: {contains: search, mode: 'insensitive'}},
        {description: {contains: search, mode: 'insensitive'}}
      ]
    }

    const total = await this.prisma.product.count({where});

    const products = await this.prisma.product.findMany({
      where,
      skip: (page -1) * limit,
      take: limit,
      orderBy: {
        createdAt: 'desc'
      },
      include: {category: true}
    })
    return {
      data: products.map(product=> this.formatProduct(product)),
      meta: {total, page, limit, totalPage: Math.ceil(total / limit)}
    };
  }

  async findOne(id: string): Promise<ProductResponseDto> {
    const product = await this.prisma.product.findUnique({where: {id}, include: {category: true}});
    if(!product) {
      throw new NotFoundException('Product not found');
    }
    return this.formatProduct(product);
  }

  async update(id: string, updateProductDto: UpdateProductDto):Promise<ProductResponseDto> {
    const productExists = await this.prisma.product.findUnique({where: {id}});
    if(!productExists) {
      throw new NotFoundException('Product not found');
    }

    if(updateProductDto.sku && updateProductDto.sku !== productExists.sku) {
      const productExits = await this.prisma.product.findUnique({where: {sku: updateProductDto.sku}});
      if(productExits) {
        throw new ConflictException('Product with this sku already exists');
      }
    }

    const updateData:any  = {...updateProductDto};
    if(updateProductDto.price !== undefined) {
      updateData.price = new Prisma.Decimal(updateProductDto.price);
    }
    const product = await this.prisma.product.update({where: {id}, 
      data: updateData, include: {category: true}
    });
    return this.formatProduct(product);
  }

  async updateStock(id: string, quantity: number):Promise<ProductResponseDto> {
    const productExists = await this.prisma.product.findUnique({where: {id}});
    if(!productExists) {
      throw new NotFoundException('Product not found');
    }

    const newStock = productExists.stock + quantity;
    if(newStock < 0) {
      throw new BadRequestException('Insufficient stock');
    }
    const product = await this.prisma.product.update({where: {id}, data: {stock: newStock}, include: {category: true}});
    return this.formatProduct(product);
  }


    // Remove a product
  async remove(id: string): Promise<{ message: string }> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        orderItems: true,
        cartItems: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.orderItems.length > 0) {
      throw new BadRequestException(
        'Cannot delete product that is part of existing orders. Consider marking it as inactive only',
      );
    }

    await this.prisma.product.delete({
      where: { id },
    });

    return { message: 'Product deleted successfully' };
  }

  private formatProduct(product: Product & {category: Category}): ProductResponseDto {
    return {...product, price: Number(product.price), category: product.category.name};
  }
}
