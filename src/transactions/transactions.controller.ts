import { Body, Controller, Headers, Post } from '@nestjs/common';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  @Post('topup')
  topUp(
    @Body() body,
    @Headers('idempotency-key') key: string,
  ) {
    return this.transactionsService.execute(
      body.userId,
      body.amount,
      'TOPUP',
      key,
      body.assetCode,
    );
  }

  @Post('bonus')
  bonus(
    @Body() body,
    @Headers('idempotency-key') key: string,
  ) {
    return this.transactionsService.execute(
      body.userId,
      body.amount,
      'BONUS',
      key,
      body.assetCode,
    );
  }

  @Post('spend')
  spend(
    @Body() body,
    @Headers('idempotency-key') key: string,
  ) {
    return this.transactionsService.execute(
      body.userId,
      body.amount,
      'SPEND',
      key,
      body.assetCode,
    );
  }
}
