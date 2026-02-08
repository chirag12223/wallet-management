// src/ledger/ledger.service.ts
import { Injectable } from '@nestjs/common';
import { Prisma, LedgerAccountType } from '@prisma/client';

@Injectable()
export class LedgerService {
  async getBalance(
    tx: Prisma.TransactionClient,
    walletId: string,
  ): Promise<number> {
    const result = await tx.ledgerEntry.aggregate({
      where: {
        account: {
          walletId,
          type: LedgerAccountType.USER,
        },
      },
      _sum: {
        amount: true,
      },
    });

    return Number(result._sum.amount ?? 0);
  }

  async record(
    tx: Prisma.TransactionClient,
    ledgerAccountId: string,
    transactionId: string,
    amount: number,
  ) {
    return tx.ledgerEntry.create({
      data: {
        amount: BigInt(amount),
        transaction: {
          connect: { id: transactionId },
        },
        account: {
          connect: { id: ledgerAccountId },
        },
      },
    });
  }
}
