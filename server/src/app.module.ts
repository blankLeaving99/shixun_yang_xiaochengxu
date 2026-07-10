import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { ProductsModule } from '@/modules/products/products.module';
import { CartModule } from '@/modules/cart/cart.module';
import { AddressesModule } from '@/modules/addresses/addresses.module';

@Module({
  imports: [ProductsModule, CartModule, AddressesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
