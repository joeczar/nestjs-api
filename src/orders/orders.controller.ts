import { Order } from './entities/order.entity';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Controller('orders')
export class OrdersController {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly ordersService: OrdersService,
  ) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    Logger.log('createOrderDto', createOrderDto);
    try {
      Logger.log('ordersController - create', { createOrderDto });
      const createOrder = await this.ordersService.create(createOrderDto);
      const success = await this.orderRepository.save(createOrder);
      if (success) {
        return {
          status: 201,
          message: 'Order created successfully',
        };
      }
    } catch (error) {
      Logger.error('Error creating order', error);
    }
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
