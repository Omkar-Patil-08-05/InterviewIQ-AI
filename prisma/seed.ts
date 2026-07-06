import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding demo data...')
  
  const user = await prisma.user.upsert({
    where: { email: 'demo@interviewiq.ai' },
    update: {},
    create: {
      id: 'demo-user-123',
      email: 'demo@interviewiq.ai',
      name: 'Demo Candidate',
    },
  })

  // Seed Interview and Report
  await prisma.interview.create({
    data: {
      userId: user.id,
      role: 'Frontend Engineer',
      difficulty: 'Hard',
      status: 'COMPLETED',
      interviewReports: {
        create: {
          overallScore: 92,
          hiringRecommendation: 'Strong Hire',
          confidenceLevel: 'High',
          performanceMetrics: { problemSolving: 90, communication: 85, accuracy: 95 },
          strengths: ['React Mastery', 'System Design', 'Algorithms'],
          weaknesses: ['CSS Animations', 'GraphQL'],
          learningRoadmap: { topics: ['CSS Optimization', 'Micro-frontends'] },
          companyReadiness: { Google: 90, Meta: 85, Amazon: 95 }
        }
      }
    }
  })

  console.log('Seeding finished successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
