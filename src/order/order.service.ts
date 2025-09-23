import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CustomerEntity, CustomerStatus } from "src/customer/customer.entity";
import { ProductEntity } from "src/product/entities/product.entity";
import { Between, Not, Repository } from "typeorm";
import { OrderItemEntity } from "./entites/order-item.entity";
import { OrderEntity } from "./entites/order.entity";
import { OrderStatus } from "./enums/order-status.enum";
import { PusherService } from "src/notifications/pusher.service";


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
    private readonly pusherService: PusherService,
  ){}

  async getAll() {
    return this.orderRepository.find();
  }

  async getAllOrders(): Promise<OrderEntity[]> {
  return this.orderRepository.find({
    relations: ['customer', 'items', 'items.product'],
    order: { createdAt: 'DESC' }
  });
}

async createOrder(customerId: number, items: { productId: number; quantity: number }[]) {
  const customer = await this.customerRepository.findOne({ where: { id: customerId } });
  if (!customer) throw new NotFoundException('Customer not found');

  const order = this.orderRepository.create({ 
    customer, 
    totalAmount: 0 
  });
  
  const savedOrder = await this.orderRepository.save(order);
  
  let sum = 0;
  const orderItems: OrderItemEntity[] = [];
  
  for (const item of items) {
    const product = await this.productRepository.findOne({ where: { id: item.productId } });
    if (!product) throw new NotFoundException(`Product ${item.productId} not found`);

    const orderItem = this.orderItemRepository.create({
      order: savedOrder,
      product, 
      quantity: item.quantity, 
      price: Number(product.price),
    });
    
    const savedOrderItem = await this.orderItemRepository.save(orderItem);
    orderItems.push(savedOrderItem);
    sum += Number(product.price) * item.quantity;
  }
  savedOrder.totalAmount = sum;
  const finalOrder = await this.orderRepository.save(savedOrder);
  
  await this.pusherService.triggerEvent('order-updates', 'orderStatusChanged', {
    orderId: finalOrder.id,
    status: finalOrder.status || 'created',
  });
  return await this.orderRepository.findOne({
    where: { id: finalOrder.id },
    relations: ['items', 'items.product']
  });
}

async deleteOrder(orderId: number) {
  const order = await this.orderRepository.findOne({ where: { id: orderId } });
  if (!order) {
    throw new NotFoundException(`Order ${orderId} not found`);
  }
  await this.orderRepository.remove(order);
  // await this.pusherService.triggerEvent('order-updates', 'orderDeleted', {
  //   orderId,
  //   message: 'Order deleted successfully',
  // });
  return { message: `Order ${orderId} deleted successfully` };
}

  async updateOrderStatus(orderId: number, status: string) {
    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    if (!order) throw new NotFoundException(`Order ${orderId} not found`);

    if (!Object.values(OrderStatus).includes(status as OrderStatus)) {
      throw new BadRequestException(`Invalid status: ${status}`);
    }
    order.status = status as OrderStatus;
    const updatedOrder = await this.orderRepository.save(order);

    // await this.pusherService.triggerEvent('order-updates', 'orderStatusChanged', {
    //   orderId: updatedOrder.id,
    //   status: updatedOrder.status,
    // });

    return updatedOrder;
  }

  async getOrderStatusSummary() {
    const statuses = Object.values(OrderStatus);
    const result = await Promise.all(
      statuses.map(async (status) => {
        const count = await this.orderRepository.count({ where: { status } });
        return { status, count };
      }),
    );

    return result;
  }

  async getOrderByCustomer(user: any) {
    return await this.orderRepository.find({where:{customer:{id:user.id}}});
  }

  async getTotalSalesPerYear() {
    const currentYear = new Date().getFullYear();
    const previousYear = currentYear - 1;
    const growthPercentage = await this.getYearOverYearGrowth(currentYear, previousYear);
    const sales = await this.getYearlySales(currentYear);
    return {
      totalSales: sales,
      salesGrowth: Math.round(growthPercentage * 100) / 100 // Round to 2 decimal places
    };
  }

  async getYearOverYearGrowth(currentYear, previousYear) {
    const currentYearSales = await this.getYearlySales(currentYear);
    const previousYearSales = await this.getYearlySales(previousYear);
    
    if (previousYearSales === 0) return currentYearSales > 0 ? 100 : 0;
    
    return ((currentYearSales - previousYearSales) / previousYearSales) * 100;
  }

  
  async getYearlySales(year: number): Promise<number> {
    const startDate = new Date(year, 0, 1); // January 1st of the year
    const endDate = new Date(year, 11, 31, 23, 59, 59, 999); // December 31st of the year, end of day

    const orders = await this.orderRepository.find({
      where: {
        status: OrderStatus.COMPLETED,
        createdAt: Between(startDate, endDate)
      }
    });

    let totalYearlySales = 0;
    for (const order of orders) {
      totalYearlySales += Number(order.totalAmount);
    }
    return totalYearlySales;
  }

  async getTotalOrdersPerYear() {
    const currentYear = new Date().getFullYear();
    const previousYear = currentYear - 1;
    const growthPercentage = await this.getOrderYearOverYearGrowth(currentYear, previousYear);
    const orders = await this.getYearlyOrders(currentYear);
    return {
      totalOrders: orders,
      ordersGrowth: Math.round(growthPercentage * 100) / 100 // Round to 2 decimal places
    };
  }

  async getOrderYearOverYearGrowth(currentYear, previousYear) {
    const currentYearOrders = await this.getYearlyOrders(currentYear);
    const previousYearOrders = await this.getYearlyOrders(previousYear);
    
  if (previousYearOrders === 0) return currentYearOrders > 0 ? 100 : 0;
    
    return ((currentYearOrders - previousYearOrders) / previousYearOrders) * 100;
  }

  async getYearlyOrders(year: number): Promise<number> {
    const startDate = new Date(year, 0, 1); // January 1st of the year
    const endDate = new Date(year, 11, 31, 23, 59, 59, 999); // December 31st of the year, end of day

    const orderCount = await this.orderRepository.count({
      where: {
        status: OrderStatus.COMPLETED,
        createdAt: Between(startDate, endDate)
      }
    });

    return orderCount;
  }

  async getSalesAndOrdersForLast7Years() {
    const currentYear = new Date().getFullYear();
    const results: { year: number; sales: number; orders: number }[] = [];

    for (let year = currentYear - 6; year <= currentYear; year++) {
      const totalSales = await this.getYearlySales(year);
      const totalOrders = await this.getYearlyOrders(year);
      results.push({ year, sales: totalSales, orders: totalOrders});
    }
    return results;
  }

  async getTopSellingProducts() {
    // Get all order items with their products and orders
    const orderItems = await this.orderItemRepository.find({
      relations: ['product', 'order'],
      where: {
        order: {
          status: Not(OrderStatus.CANCELLED)
        }
      }
    });

    const productSales = new Map();

    orderItems.forEach(item => {
      const productId = item.product.id;
      
      if (!productSales.has(productId)) {
        productSales.set(productId, {
          product: item.product,
          totalQuantitySold: 0,
          totalOrders: 0,
          totalRevenue: 0,
          orderIds: new Set()
        });
      }

      const productData = productSales.get(productId);
      productData.totalQuantitySold += item.quantity;
      productData.totalRevenue += item.quantity * Number(item.price);
      productData.orderIds.add(item.order.id);
    });

    const productsArray = Array.from(productSales.values()).map(data => ({
      productId: data.product.id,
      productName: data.product.name,
      productPrice: Number(data.product.price),
      productImage: data.product.image,
      productCategory: data.product.category,
      totalQuantitySold: data.totalQuantitySold,
      totalOrders: data.orderIds.size,
      totalRevenue: Math.round(data.totalRevenue * 100) / 100
    }));

    return productsArray
      .sort((a, b) => b.totalQuantitySold - a.totalQuantitySold)
      .slice(0, 7);
  }

  async getTopCustomers(limit: number = 5): Promise<any[]> {
  // Get all orders with customers
  const orders = await this.orderRepository.find({
    relations: ['customer'],
    where: {
      customer: { status: CustomerStatus.ACTIVE }
    }
  });

  // Group orders by customer and calculate metrics
  const customerStats = new Map();
  
  orders.forEach(order => {
    const customerId = order.customer.id;
    
    if (!customerStats.has(customerId)) {
      customerStats.set(customerId, {
        customerId,
        firstName: order.customer.firstName,
        lastName: order.customer.lastName,
        email: order.customer.email,
        totalOrders: 0,
        totalSpent: 0,
        orders: []
      });
    }
    
    const stats = customerStats.get(customerId);
    stats.totalOrders += 1;
    stats.totalSpent += parseFloat(order.totalAmount.toString());
    stats.orders.push(order);
  });

  // Convert to array and calculate additional metrics
  const topCustomers = Array.from(customerStats.values())
    .map(customer => ({
      ...customer,
      averageOrderValue: customer.totalSpent / customer.totalOrders,
      lastOrderDate: new Date(Math.max(...customer.orders.map(o => new Date(o.createdAt).getTime())))
    }))
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, limit)
    .map(({ orders, ...customer }) => customer); // Remove orders array from final result

  return topCustomers;
}

}