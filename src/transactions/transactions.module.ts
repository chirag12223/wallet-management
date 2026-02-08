import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { WalletsService } from '../wallets/wallets.service';
import { LedgerService } from '../ledger/ledger.service';
import { LedgerRepository } from '../ledger/ledger.repository';

@Module({
  controllers: [TransactionsController],
  providers: [
    TransactionsService,
    WalletsService,
    LedgerService,
    LedgerRepository,
  ],
})
export class TransactionsModule {}
