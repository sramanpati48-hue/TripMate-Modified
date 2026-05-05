// Script to populate database with sample travel profiles for testing matchmaker feature

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const sampleUsers = [
  {
    email: 'alex.adventure@example.com',
    password: 'Test123456',
    name: 'Alex Kumar',
    city: 'Mumbai',
    country: 'India',
    profile: {
      gender: 'male',
      preferredGender: 'any',
      travelStyle: 'adventure',
      groupPreference: 'any',
      ageRange: '26-35',
      interests: ['Hiking', 'Photography', 'Adventure Sports', 'Local Culture'],
      destinations: ['Ladakh', 'Nepal', 'Bhutan', 'Himachal Pradesh'],
      languages: ['English', 'Hindi'],
      bio: 'Adventure enthusiast looking for travel companions to explore the Himalayas! Love trekking, photography, and meeting new people.',
      isActive: true,
    },
  },
  {
    email: 'priya.cultural@example.com',
    password: 'Test123456',
    name: 'Priya Sharma',
    city: 'Delhi',
    country: 'India',
    profile: {
      gender: 'female',
      preferredGender: 'any',
      travelStyle: 'cultural',
      groupPreference: 'group',
      ageRange: '26-35',
      interests: ['Museums', 'History', 'Photography', 'Food & Cuisine', 'Local Culture'],
      destinations: ['Rajasthan', 'Kerala', 'Varanasi', 'Hampi'],
      languages: ['English', 'Hindi', 'Tamil'],
      bio: 'Culture lover and history buff! Looking to explore India\'s rich heritage with like-minded travelers.',
      isActive: true,
    },
  },
  {
    email: 'rahul.beach@example.com',
    password: 'Test123456',
    name: 'Rahul Verma',
    city: 'Bangalore',
    country: 'India',
    profile: {
      gender: 'male',
      preferredGender: 'any',
      travelStyle: 'relaxation',
      groupPreference: 'any',
      ageRange: '26-35',
      interests: ['Beach', 'Photography', 'Food & Cuisine', 'Yoga & Wellness'],
      destinations: ['Goa', 'Andaman', 'Lakshadweep', 'Pondicherry'],
      languages: ['English', 'Hindi', 'Kannada'],
      bio: 'Beach bum and foodie! Always up for coastal adventures and trying local cuisines.',
      isActive: true,
    },
  },
  {
    email: 'meera.adventure@example.com',
    password: 'Test123456',
    name: 'Meera Patel',
    city: 'Ahmedabad',
    country: 'India',
    profile: {
      gender: 'female',
      preferredGender: 'female',
      travelStyle: 'adventure',
      groupPreference: 'solo',
      ageRange: '18-25',
      interests: ['Hiking', 'Adventure Sports', 'Wildlife', 'Photography'],
      destinations: ['Spiti Valley', 'Ladakh', 'Uttarakhand', 'Northeast India'],
      languages: ['English', 'Hindi', 'Gujarati'],
      bio: 'Solo female traveler seeking adventure buddies! Love mountains, wildlife, and offbeat destinations.',
      isActive: true,
    },
  },
  {
    email: 'arjun.luxury@example.com',
    password: 'Test123456',
    name: 'Arjun Singh',
    city: 'Jaipur',
    country: 'India',
    profile: {
      gender: 'male',
      preferredGender: 'any',
      travelStyle: 'luxury',
      groupPreference: 'group',
      ageRange: '36-45',
      interests: ['Shopping', 'Food & Cuisine', 'Museums', 'Nightlife'],
      destinations: ['Dubai', 'Maldives', 'Singapore', 'Bali'],
      languages: ['English', 'Hindi'],
      bio: 'Luxury travel enthusiast. Love premium experiences, fine dining, and exclusive destinations.',
      isActive: true,
    },
  },
  {
    email: 'sneha.backpacker@example.com',
    password: 'Test123456',
    name: 'Sneha Reddy',
    city: 'Hyderabad',
    country: 'India',
    profile: {
      gender: 'female',
      preferredGender: 'any',
      travelStyle: 'backpacker',
      groupPreference: 'any',
      ageRange: '18-25',
      interests: ['Hiking', 'Local Culture', 'Food & Cuisine', 'Beach', 'Photography'],
      destinations: ['Thailand', 'Vietnam', 'Nepal', 'Sri Lanka'],
      languages: ['English', 'Hindi', 'Telugu'],
      bio: 'Budget backpacker exploring Southeast Asia! Love hostels, street food, and making friends from around the world.',
      isActive: true,
    },
  },
  {
    email: 'vikram.wildlife@example.com',
    password: 'Test123456',
    name: 'Vikram Joshi',
    city: 'Pune',
    country: 'India',
    profile: {
      gender: 'male',
      preferredGender: 'any',
      travelStyle: 'adventure',
      groupPreference: 'any',
      ageRange: '26-35',
      interests: ['Wildlife', 'Photography', 'Hiking', 'Local Culture'],
      destinations: ['Jim Corbett', 'Ranthambore', 'Kaziranga', 'Bandhavgarh'],
      languages: ['English', 'Hindi', 'Marathi'],
      bio: 'Wildlife photographer and nature lover. Looking for companions to explore India\'s national parks and sanctuaries.',
      isActive: true,
    },
  },
  {
    email: 'ananya.yoga@example.com',
    password: 'Test123456',
    name: 'Ananya Das',
    city: 'Kolkata',
    country: 'India',
    profile: {
      gender: 'female',
      preferredGender: 'any',
      travelStyle: 'relaxation',
      groupPreference: 'group',
      ageRange: '26-35',
      interests: ['Yoga & Wellness', 'Beach', 'Food & Cuisine', 'Local Culture'],
      destinations: ['Rishikesh', 'Kerala', 'Goa', 'Bali'],
      languages: ['English', 'Hindi', 'Bengali'],
      bio: 'Yoga instructor and wellness enthusiast. Seeking peaceful retreats and spiritual journeys with mindful travelers.',
      isActive: true,
    },
  },
];

async function createSampleProfiles() {
  console.log('🚀 Starting to create sample travel profiles...\n');

  for (const userData of sampleUsers) {
    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email },
      });

      if (existingUser) {
        console.log(`⏭️  User ${userData.email} already exists, skipping...`);
        continue;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      // Create user
      const user = await prisma.user.create({
        data: {
          email: userData.email,
          password: hashedPassword,
          name: userData.name,
          city: userData.city,
          country: userData.country,
        },
      });

      // Create travel profile
      await prisma.travelProfile.create({
        data: {
          userId: user.id,
          gender: userData.profile.gender,
          preferredGender: userData.profile.preferredGender,
          travelStyle: userData.profile.travelStyle,
          groupPreference: userData.profile.groupPreference,
          ageRange: userData.profile.ageRange,
          interests: JSON.stringify(userData.profile.interests),
          destinations: JSON.stringify(userData.profile.destinations),
          languages: JSON.stringify(userData.profile.languages),
          bio: userData.profile.bio,
          isActive: userData.profile.isActive,
        },
      });

      console.log(`✅ Created user and profile: ${userData.name} (${userData.email})`);
    } catch (error) {
      console.error(`❌ Error creating ${userData.email}:`, error.message);
    }
  }

  console.log('\n🎉 Sample profiles creation complete!');
  console.log('\n📋 Login credentials for all accounts:');
  console.log('Password: Test123456\n');
  console.log('Accounts created:');
  sampleUsers.forEach((user, index) => {
    console.log(`${index + 1}. ${user.name} - ${user.email} (${user.profile.travelStyle})`);
  });
}

createSampleProfiles()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
