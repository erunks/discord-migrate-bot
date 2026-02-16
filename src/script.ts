import { prisma } from './lib/prisma';

async function main() {
  // Create a new guild record
  await prisma.guild.create({
    data: {
      externalId: '1234567890',
      name: 'Test Guild',
    },
  })

  // Fetch all guilds
  const allGuilds = await prisma.guild.findMany()
  console.log('All guilds:', JSON.stringify(allGuilds, null, 2))
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })