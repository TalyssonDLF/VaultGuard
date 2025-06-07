import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super();
  }
}
// This service extends PrismaClient to provide database access throughout the application.
// It can be injected into other services or controllers to perform database operations.