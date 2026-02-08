import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, LedgerAccountType } from '@prisma/client';

@Injectable()
export class WalletsService {
  constructor(private prisma: PrismaService) {}

  async getWalletForUpdate(tx, userId: string, assetId) {
    console.log(userId, assetId)
    const wallet = await tx.wallet.findUnique({
      where: {
        userId_assetId: {
          userId,
          assetId,
        },
      },
    });

    if (!wallet) {
      throw new BadRequestException('Wallet not found');
    }

    return wallet;
  }

  async updateBalance(tx, walletId: string, balance: number) {
    return tx.wallet.update({
      where: { id: walletId },
      data: { balance },
    });
  }

  async getWalletWithAccount(
    tx: Prisma.TransactionClient,
    userId: string,
    assetId: string,
  ) {
    const wallet = await tx.wallet.findUnique({
      where: {
        userId_assetId: {
          userId,
          assetId,
        },
      },
      include: {
        accounts: true,
      },
    });

    if (!wallet) throw new NotFoundException('Wallet not found');

    const userAccount = wallet.accounts.find(
      (a) => a.type === LedgerAccountType.USER,
    );

    if (!userAccount) {
      throw new Error('User ledger account missing');
    }

    return { wallet, userAccount };
  }
}
