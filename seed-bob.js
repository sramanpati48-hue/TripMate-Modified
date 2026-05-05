const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

async function main() {
  try {
    console.log('Connecting to database...');
    // Find the user's account (trying testsqlite@example.com first)
    let mainUser = await prisma.user.findFirst({
      where: { email: 'testsqlite@example.com' }
    });

    if (!mainUser) {
      console.log('Test User not found, finding any user...');
      mainUser = await prisma.user.findFirst();
      if (!mainUser) {
        throw new Error('No users found in database at all!');
      }
    }
    console.log(`Found main user: ${mainUser.name} (${mainUser.email})`);

    // Ensure main user has a travel profile (otherwise match requests might fail or not show)
    let mainProfile = await prisma.travelProfile.findFirst({ where: { userId: mainUser.id } });
    if (!mainProfile) {
      console.log('Main user has no travel profile. Creating one...');
      mainProfile = await prisma.travelProfile.create({
        data: {
          userId: mainUser.id,
          gender: 'any',
          preferredGender: 'any',
          travelStyle: 'adventure',
          groupPreference: 'any'
        }
      });
    }

    // Create the second account
    console.log('Creating Bob test account...');
    const bobPassword = await bcrypt.hash('password123', 10);
    const bob = await prisma.user.upsert({
      where: { email: 'bob@example.com' },
      update: {},
      create: {
        email: 'bob@example.com',
        name: 'Bob Traveler',
        password: bobPassword,
        city: 'New York',
        country: 'USA',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      }
    });

    // Create a travel profile for Bob so he appears in the matchmaker properly
    console.log('Creating Bob travel profile...');
    await prisma.travelProfile.upsert({
      where: { userId: bob.id },
      update: {},
      create: {
        userId: bob.id,
        gender: 'male',
        preferredGender: 'any',
        travelStyle: 'chill',
        groupPreference: 'any',
        bio: 'Hey! Im Bob, looking for someone to travel with this summer.'
      }
    });

    // Delete any existing requests between Bob and MainUser so we start fresh
    await prisma.travelMatchRequest.deleteMany({
      where: {
        OR: [
          { senderId: bob.id, receiverId: mainUser.id },
          { senderId: mainUser.id, receiverId: bob.id }
        ]
      }
    });

    // Create a PENDING request
    console.log('Sending a pending travel request from Bob to Main User...');
    await prisma.travelMatchRequest.create({
      data: {
        senderId: bob.id,
        receiverId: mainUser.id,
        status: 'pending',
        destination: 'Tokyo, Japan',
        message: 'Hey, saw your profile. Want to go to Japan together?'
      }
    });

    console.log('\n--- SUCCESS! ---');
    console.log('Bob account created: bob@example.com / password123');
    console.log(`Sent a pending request to ${mainUser.name}!`);
  } catch (e) {
    console.error('Error in script:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
