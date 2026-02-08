import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(name: string) {
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: { name },
      });
      const assets = await tx.asset.findMany();
      for (const asset of assets) {
        const wallet = await tx.wallet.create({
          data: {
            userId: user.id,
            assetId: asset.id,
          },
        });
        await tx.ledgerAccount.create({
          data: {
            walletId: wallet.id,
            type: 'USER',
            name: `${user.name}-${asset.code}`,
          },
        });
      }

      return user;
    });
  }

  async listUsers(filters: any) {
    const { userId, assetCode } = filters;

    return this.prisma.user.findMany({
      where: {
        ...(userId && { id: userId }),
        ...(assetCode && {
          wallets: {
            some: {
              asset: {
                code: assetCode,
              },
            },
          },
        }),
      },
      include: {
        wallets: {
          include: {
            asset: true,
          },
        },
      },
    });
  }
}
