import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const prismaClientSingleton = () => {
  let connectionString = process.env.DATABASE_URL!
  
  // The 'pg' module doesn't understand prisma+postgres://, so we extract the native URL
  if (connectionString.startsWith('prisma+postgres://')) {
    try {
      const url = new URL(connectionString)
      const apiKey = url.searchParams.get('api_key')
      if (apiKey) {
        const decoded = JSON.parse(Buffer.from(apiKey, 'base64').toString('utf-8'))
        if (decoded.databaseUrl) {
          connectionString = decoded.databaseUrl
        }
      }
    } catch (e) {
      console.error("Failed to parse Prisma Postgres URL", e)
    }
  }

  const pool = new Pool({ 
    connectionString, 
    max: 3, 
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 30000
  })
  const adapter = new PrismaPg(pool)

  return new PrismaClient({ adapter })
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma

export default prisma
