import { Body, Controller, Get, Post, Request, UseGuards } from "@nestjs/common";
import { OrderService } from "./order.service";
import { Roles } from "src/auth/decorators/roles.decorator";
import { Role } from "src/auth/enums/role.enum";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { AuthGuard } from "src/auth/guards/auth.guard";

@UseGuards(AuthGuard, RolesGuard)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('/create-my-order')
  createOrder(@Request() req, @Body() body: { items: { productId: number; quantity: number }[] }) {
    return this.orderService.createOrder(req.user, body.items);
  }

  @Get('get-my-orders')
  getMyOrders(@Request() req) {
    return this.orderService.getOrderByCustomer(req.user);
  }

//   @Get('get-customer-orders/:customerId')
//   getCustomerOrders(@Request() req) {
//     return this.orderService.getOrderByCustomer(req.user);
//   }



}