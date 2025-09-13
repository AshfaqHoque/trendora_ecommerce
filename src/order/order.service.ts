import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CustomerEntity } from "src/customer/customer.entity";
import { ProductEntity } from "src/product/entities/product.entity";
import { Repository } from "typeorm";
import { OrderItemEntity } from "./entites/order-item.entity";
import { OrderEntity } from "./entites/order.entity";


@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
    @InjectRepository(OrderItemEntity)
    private orderItemRepository: Repository<OrderItemEntity>,
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
    @InjectRepository(CustomerEntity)
    private customerRepository: Repository<CustomerEntity>,
  ){}

  async getAll() {
    return this.orderRepository.find();
  }

  async createOrder(customerId: string, items: { productId: number; quantity: number }[]) {
    const customer = await this.customerRepository.findOne({ where: { id: customerId } });
    if (!customer) throw new NotFoundException('Customer not found');

    const order = this.orderRepository.create({ customer, items: [], totalAmount: 0 });
    
    let sum = 0;
    for (const item of items) {
      const product = await this.productRepository.findOne({where: {id:item.productId}});
      if (!product) throw new NotFoundException(`Product ${item.productId} not found`);

      const orderItem = this.orderItemRepository.create({
      order, product, 
      quantity: item.quantity, 
      price: Number(product.price),
      });
      order.items.push(orderItem);

      sum += Number(product.price) * item.quantity;
    }
    order.totalAmount = sum;
    return this.orderRepository.save(order);
  }

  async getOrderByCustomer(user: any) {
    return await this.orderRepository.find({where:{customer:{id:user.id}}});
  }

}