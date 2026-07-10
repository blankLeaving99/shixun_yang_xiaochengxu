import { Controller, Get, Param } from '@nestjs/common';
import { ProductsService } from './products.service';
import { HttpCode } from '@nestjs/common';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @HttpCode(200)
  async findAll() {
    const products = await this.productsService.findAll();
    return { status: 'success', data: products };
  }

  @Get('hot')
  @HttpCode(200)
  async findHot() {
    const products = await this.productsService.findHot();
    return { status: 'success', data: products };
  }

  @Get(':id')
  @HttpCode(200)
  async findOne(@Param('id') id: string) {
    const product = await this.productsService.findOne(id);
    if (!product) {
      return { status: 'error', message: '商品不存在', data: null };
    }
    return { status: 'success', data: product };
  }
}