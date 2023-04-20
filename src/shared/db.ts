import { PrismaClient } from '@prisma/client'

export type ClientSideItem<T> = { [K in keyof T]: T[K] extends Date ? string : T[K] }

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
