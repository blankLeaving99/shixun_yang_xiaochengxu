import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { HttpCode } from '@nestjs/common';

@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Get()
  @HttpCode(200)
  async findAll() {
    const addresses = await this.addressesService.findAll();
    return { status: 'success', data: addresses };
  }

  @Get(':id')
  @HttpCode(200)
  async findOne(@Param('id') id: string) {
    const address = await this.addressesService.findOne(id);
    if (!address) {
      return { status: 'error', message: '地址不存在', data: null };
    }
    return { status: 'success', data: address };
  }

  @Post()
  @HttpCode(200)
  async create(@Body() body: {
    name: string;
    phone: string;
    province: string;
    city: string;
    district: string;
    address: string;
    is_default: boolean;
  }) {
    const address = await this.addressesService.create(body);
    return { status: 'success', data: address };
  }

  @Put(':id')
  @HttpCode(200)
  async update(
    @Param('id') id: string,
    @Body() body: Partial<{
      name: string;
      phone: string;
      province: string;
      city: string;
      district: string;
      address: string;
      is_default: boolean;
    }>
  ) {
    const address = await this.addressesService.update(id, body);
    return { status: 'success', data: address };
  }

  @Put(':id/default')
  @HttpCode(200)
  async setDefault(@Param('id') id: string) {
    const address = await this.addressesService.setDefault(id);
    return { status: 'success', data: address };
  }

  @Delete(':id')
  @HttpCode(200)
  async remove(@Param('id') id: string) {
    await this.addressesService.remove(id);
    return { status: 'success', message: '已删除' };
  }
}