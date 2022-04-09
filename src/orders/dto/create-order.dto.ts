import { Order } from './../entities/order.entity';
export class CreateOrderDto extends Order {
  userId: string;
  meal: string;
  place: string;
  items: string[];
  cookId: string;
}
