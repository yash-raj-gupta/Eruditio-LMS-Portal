import {PrismaClient} from'@prisma/client'

declare global {
    var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient();

if(process.env.NODE_ENV !== 'production') globalThis.prisma = db

// we are using this syntax to prevent the overflow error as every time we save our project in development mode a new port is there and a new instance of prisma will be created everytime to in order to prevent this error in hot reload we write the syntaxx as this.

// Hence saves the project from crashing in development.
