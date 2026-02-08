import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LedgerRepository {
  constructor(private prisma: PrismaService) {}

  createEntry(
    tx,
    walletId: string,
    transactionId: string,
    amount: number,
  ) {
    return tx.ledgerEntry.create({
      data: {
        walletId,
        transactionId,
        amount,
      },
    });
  }
}
