import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class IdempotencyGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const key = request.headers['idempotency-key'];

    if (!key) return true;

    const exists = await this.prisma.idempotencyKey.findUnique({
      where: { key },
    });

    if (exists) {
      request.existingTransaction = exists.transactionId;
      return false;
    }

    request.idempotencyKey = key;
    return true;
  }
}
