import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Request, UseGuards } from "@nestjs/common";
import { OrderService } from "./order.service";
import { Roles } from "src/auth/decorators/roles.decorator";
import { Role } from "src/auth/enums/role.enum";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { AuthGuard } from "src/auth/guards/auth.guard";

//@UseGuards(AuthGuard, RolesGuard)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('/create-my-order')
  createOrder(@Body() body: { customerId: number; items: { productId: number; quantity: number }[] }) {
    return this.orderService.createOrder(body.customerId, body.items);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  async deleteOrder(@Param('id') id: string) {
    const orderId = parseInt(id, 10);
    return this.orderService.deleteOrder(orderId);
  }

  @Get('get-my-orders')
  getMyOrders(@Request() req) {
    return this.orderService.getOrderByCustomer(req.user);
  }

  @Roles(Role.Admin)
  @Get()
  getAllOrders() {
    return this.orderService.getAllOrders();
  }

  @Roles(Role.Admin)
  @Get('total-sales')
  getTotalSales() {
    return this.orderService.getTotalSalesPerYear();
  }

  @Roles(Role.Admin)
  @Get('total-orders')
  getTotalOrders() {
    return this.orderService.getTotalOrdersPerYear();
  }

  @Roles(Role.Admin)
  @Get('yearly-stats')
  async getYearlyStats() {
    return this.orderService.getSalesAndOrdersForLast7Years();
  }
  
  @Roles(Role.Admin)
  @Get("top-selling-products")
  async getTopSellingProducts() {
    return this.orderService.getTopSellingProducts();
  }

  @Roles(Role.Admin)
  @Patch(':id/status')
  async updateOrderStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: string
  ) {
    return this.orderService.updateOrderStatus(id, status);
  }



//   @Get('get-customer-orders/:customerId')
//   getCustomerOrders(@Request() req) {
//     return this.orderService.getOrderByCustomer(req.user);
//   }



}