import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WalletsService } from '../wallets/wallets.service';
import { LedgerService } from '../ledger/ledger.service';

@Injectable()
export class TransactionsService {
  constructor(
    private prisma: PrismaService,
    private walletsService: WalletsService,
    private ledgerService: LedgerService,
  ) {}

  async execute(
  userId: string,
  amount: number,
  type: 'TOPUP' | 'BONUS' | 'SPEND',
  idempotencyKey: string,
  assetCode: string,
) {
  const asset = await this.getAssetByCode(assetCode);

  return this.prisma.$transaction(
    async (tx) => {
      const { wallet, userAccount } =
        await this.walletsService.getWalletWithAccount(
          tx,
          userId,
          asset.id,
        );
      const balance = await this.ledgerService.getBalance(tx, wallet.id);
      if (type === 'SPEND' && balance < amount) {
        throw new BadRequestException('Insufficient balance');
      }
      const delta = type === 'SPEND' ? -amount : amount;
      const transaction = await tx.transaction.create({
        data: {
          type,
          reference: `${type}-${userId}-${Date.now()}`,
        },
      });
      await this.ledgerService.record(
        tx,
        userAccount.id,
        transaction.id,
        delta,
      );
      await tx.idempotencyKey.create({
        data: {
          key: idempotencyKey,
          transactionId: transaction.id,
        },
      });

      return {
        transactionId: transaction.id,
        balance: balance + delta,
      };
    },
    { isolationLevel: 'Serializable' },
  );
}

  async getAssetByCode(code: string) {
    const asset = await this.prisma.asset.findUnique({
      where: { code },
    });

    if (!asset) {
      throw new BadRequestException(`Invalid asset code: ${code}`);
    }

    return asset;
  }
}
