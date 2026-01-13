
// To run this script, use: npm run seed
// This script will populate your Firestore database with dummy data.
// Before running, make sure you have authenticated with the Firebase CLI
// and have set up a service account for the Admin SDK.
// For more info on service accounts: https://firebase.google.com/docs/admin/setup

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { firebaseConfig } from '../firebase/config'; // Using client config just for projectId

// --- IMPORTANT ---
// To run this script, you need to authenticate using a service account.
// 1. Go to your Firebase Project Settings -> Service accounts.
// 2. Click "Generate new private key" and download the JSON file.
// 3. Save this file as `serviceAccountKey.json` in the ROOT of your project.
// 4. IMPORTANT: Add `serviceAccountKey.json` to your `.gitignore` file to avoid committing it.
let serviceAccount: any;
try {
  serviceAccount = require('../../serviceAccountKey.json');
} catch (e) {
  console.error(
    'Error: `serviceAccountKey.json` not found in the project root.'
  );
  console.error(
    'Please download it from your Firebase project settings and place it in the root directory.'
  );
  process.exit(1);
}

// Initialize Firebase Admin SDK
initializeApp({
  credential: cert(serviceAccount),
  projectId: firebaseConfig.projectId,
});

const firestore = getFirestore();
const auth = getAuth();

const DUMMY_USERS = [
  {
    email: 'sara.p@example.com',
    password: 'password123',
    firstName: 'Sara',
    lastName: 'Palmer',
    userName: 'sara_paws',
    bio: 'Lover of all things fluffy. My golden retriever, Max, is my best friend. Always up for a hike!',
    city: 'Boulder',
    state: 'CO',
    country: 'USA',
    discoverable: true,
    pets: [
      {
        name: 'Max',
        breed: 'Golden Retriever',
        age: '4 years',
        bio: 'A certified good boy who loves chasing squirrels and napping in sunbeams.',
        imageUrl: 'https://picsum.photos/seed/max/400/400'
      },
    ],
  },
  {
    email: 'arjun.r@example.com',
    password: 'password123',
    firstName: 'Arjun',
    lastName: 'Rao',
    userName: 'arjun_and_luna',
    bio: 'Cat dad to a mischievous Indie cat named Luna. Software engineer by day, professional cat cuddler by night.',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    discoverable: true,
    pets: [
      {
        name: 'Luna',
        breed: 'Indie',
        age: '2 years',
        bio: 'I may be small, but I am the queen of this castle. I enjoy knocking things off tables.',
        imageUrl: 'https://picsum.photos/seed/luna/400/400'
      },
    ],
  },
  {
    email: 'chen.w@example.com',
    password: 'password123',
    firstName: 'Chen',
    lastName: 'Wang',
    userName: 'chen_walks_dogs',
    bio: 'Exploring the city with my two best buds, Rocky and Apollo. We love finding new parks and cafes.',
    city: 'New York',
    state: 'NY',
    country: 'USA',
    discoverable: false, // This user will not show up in search
    pets: [
      {
        name: 'Rocky',
        breed: 'French Bulldog',
        age: '3 years',
        bio: 'Likes: snacks. Dislikes: bath time.',
        imageUrl: 'https://picsum.photos/seed/rocky/400/400'
      },
      {
        name: 'Apollo',
        breed: 'Beagle',
        age: '5 years',
        bio: 'My nose knows all the secrets. I will lead you to the best smells.',
        imageUrl: 'https://picsum.photos/seed/apollo/400/400'
      },
    ],
  },
  {
    email: 'priya.s@example.com',
    password: 'password123',
    firstName: 'Priya',
    lastName: 'Sharma',
    userName: 'priya_and_kiwi',
    bio: 'Bird enthusiast and proud parakeet parent. Kiwi brings so much color and song into my life!',
    city: 'Mysuru',
    state: 'Karnataka',
    country: 'India',
    discoverable: true,
    pets: [
      {
        name: 'Kiwi',
        breed: 'Parakeet',
        age: '1 year',
        bio: 'Chirp chirp! I love millet seeds and shiny things.',
        imageUrl: 'https://picsum.photos/seed/kiwi/400/400'
      },
    ],
  },
];

async function seedDatabase() {
  console.log('Starting database seed...');

  for (const userData of DUMMY_USERS) {
    try {
      console.log(`Creating user: ${userData.email}`);

      // Create user in Firebase Auth
      const userRecord = await auth.createUser({
        email: userData.email,
        password: userData.password,
        displayName: `${userData.firstName} ${userData.lastName}`,
      });
      const uid = userRecord.uid;
      
      const petIds: string[] = [];
      
      // Create pet documents
      for (const petData of userData.pets) {
          const petRef = firestore.collection('pets').doc();
          await petRef.set({
              ...petData,
              id: petRef.id,
              ownerId: uid,
          });
          petIds.push(petRef.id);
          console.log(`  - Created pet: ${petData.name} for user ${userData.email}`);
      }

      // Create user profile document in Firestore
      const userProfileRef = firestore.collection('users').doc(uid);
      await userProfileRef.set({
        id: uid,
        email: userData.email,
        userName: userData.userName,
        firstName: userData.firstName,
        lastName: userData.lastName,
        bio: userData.bio,
        city: userData.city,
        state: userData.state,
        country: userData.country,
        petIds: petIds,
        discoverable: userData.discoverable,
        onboardingCompleted: true, // Mark onboarding as complete for these users
        profilePicture: `https://i.pravatar.cc/150?u=${userData.email}`
      });

      console.log(`Successfully created user and profile for ${userData.email}`);
    } catch (error: any) {
      if (error.code === 'auth/email-already-exists') {
        console.warn(`User ${userData.email} already exists. Skipping.`);
      } else {
        console.error(`Failed to create user ${userData.email}:`, error);
      }
    }
  }

  console.log('Database seeding complete!');
}

seedDatabase().catch((error) => {
  console.error('An unexpected error occurred during seeding:', error);
});
