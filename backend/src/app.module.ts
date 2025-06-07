import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [AuthModule, UserModule, PrismaModule],
})
export class AppModule {}
// This code defines the main application module for a NestJS application.
// It imports three modules: AuthModule, UserModule, and PrismaModule.