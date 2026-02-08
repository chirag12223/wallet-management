import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  createUser(@Body() dto: CreateUserDto) {
    return this.usersService.createUser(dto.name);
  }

  @Get()
  listUsers(
    @Query('userId') userId?: string,
    @Query('assetCode') assetCode?: string,
  ) {
    return this.usersService.listUsers({ userId, assetCode });
  }
}
