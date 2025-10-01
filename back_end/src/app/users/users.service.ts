import { Injectable } from '@nestjs/common';
import { PrismaService } from '@root/prisma/prisma.service';
import { Prisma, users } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUserById(id: number): Promise<users | null> {
    return await this.prisma.users.findUnique({
      where: {
        id,
      },
    });
  }

  async getUserByEmail(email: string): Promise<users | null> {
    return this.prisma.users.findUnique({
      where: {
        email,
      },
    });
  }

  async createUser(data: Prisma.usersCreateInput): Promise<users> {
    return this.prisma.users.create({
      data,
    });
  }

  async updateUser(
    where: Prisma.usersWhereUniqueInput,
    data: Prisma.usersUpdateInput,
  ): Promise<users> {
    return this.prisma.users.update({
      data,
      where,
    });
  }

  async deleteUser(where: Prisma.usersWhereUniqueInput): Promise<users> {
    return this.prisma.users.delete({
      where,
    });
  }
}
