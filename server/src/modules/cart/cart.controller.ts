import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { CartService } from './cart.service';
import { HttpCode } from '@nestjs/common';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @HttpCode(200)
  async getCart() {
    const items = await this.cartService.getCart();
    return { status: 'success', data: items };
  }

  @Post('add')
  @HttpCode(200)
  async addToCart(@Body() body: { product_id: number; quantity: number }) {
    const item = await this.cartService.addToCart(body.product_id, body.quantity);
    return { status: 'success', data: item };
  }

  @Put(':id/quantity')
  @HttpCode(200)
  async updateQuantity(
    @Param('id') id: string,
    @Body() body: { quantity: number }
  ) {
    const item = await this.cartService.updateQuantity(id, body.quantity);
    return { status: 'success', data: item };
  }

  @Put(':id/selected')
  @HttpCode(200)
  async updateSelected(
    @Param('id') id: string,
    @Body() body: { selected: boolean }
  ) {
    const item = await this.cartService.updateSelected(id, body.selected);
    return { status: 'success', data: item };
  }

  @Delete(':id')
  @HttpCode(200)
  async removeFromCart(@Param('id') id: string) {
    await this.cartService.removeFromCart(id);
    return { status: 'success', message: '已删除' };
  }

  @Delete('clear')
  @HttpCode(200)
  async clearCart() {
    await this.cartService.clearCart();
    return { status: 'success', message: '已清空' };
  }
}