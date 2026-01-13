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
    email: 'sp@gmail.com',
    password: 'password',
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
        imageUrl:
          'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxnb2xkZW4lMjByZXRyaWV2ZXIlMjBkb2d8ZW58MHx8fHwxNzY4MjA3MTQ3fDA&ixlib=rb-4.1.0&q=80&w=1080',
      },
    ],
  },
  {
    email: 'ar@gmail.com',
    password: 'password',
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
        imageUrl:
          'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxjYXR8ZW58MHx8fHwxNzY4MjA3MTQ5fDA&ixlib=rb-4.1.0&q=80&w=1080',
      },
    ],
  },
  {
    email: 'cw@gmail.com',
    password: 'password',
    firstName: 'Chen',
    lastName: 'Wang',
    userName: 'chen_walks_dogs',
    bio: 'Exploring the city with my two best buds, Rocky and Apollo. We love finding new parks and cafes.',
    city: 'New York',
    state: 'NY',
    country: 'USA',
    discoverable: true,
    pets: [
      {
        name: 'Rocky',
        breed: 'French Bulldog',
        age: '3 years',
        bio: 'Likes: snacks. Dislikes: bath time.',
        imageUrl:
          'https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxGcmVuY2glMjBCdWxsZG9nfGVufDB8fHx8MTc2ODIwNzE0OXww&ixlib=rb-4.1.0&q=80&w=1080',
      },
      {
        name: 'Apollo',
        breed: 'Beagle',
        age: '5 years',
        bio: 'My nose knows all the secrets. I will lead you to the best smells.',
        imageUrl:
          'https://images.unsplash.com/photo-1543886151-3bc2b944b718?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxiZWFnbGV8ZW58MHx8fHwxNzY4MjA3MTQ5fDA&ixlib=rb-4.1.0&q=80&w=1080',
      },
    ],
  },
  {
    email: 'ps@gmail.com',
    password: 'password',
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
        imageUrl:
          'https://images.unsplash.com/photo-1544393669-d64f699044d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxwYXJha2VldHxlbnwwfHx8fDE3NjgyMDcxNTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      },
    ],
  },
];

async function clearCollection(collectionPath: string) {
  const collectionRef = firestore.collection(collectionPath);
  const snapshot = await collectionRef.limit(500).get();

  if (snapshot.empty) {
    console.log(`Collection '${collectionPath}' is already empty.`);
    return;
  }

  console.log(`Deleting ${snapshot.size} documents from '${collectionPath}'...`);
  const batch = firestore.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });

  await batch.commit();

  // Recurse if there are more documents to delete
  if (snapshot.size === 500) {
    await clearCollection(collectionPath);
  } else {
    console.log(`Successfully cleared collection '${collectionPath}'.`);
  }
}

async function seedDatabase() {
  console.log('Starting database seed...');

  // --- Clean up ---
  await clearCollection('posts');
  const postsCollection = firestore.collection('posts');
  const postsSnapshot = await postsCollection.get();
  for (const postDoc of postsSnapshot.docs) {
    await clearCollection(`posts/${postDoc.id}/comments`);
  }

  console.log('Cleanup of posts complete. Seeding new data...');

  const createdUserIds: { [key: string]: string } = {};

  for (const userData of DUMMY_USERS) {
    try {
      console.log(`Looking up user: ${userData.email}`);
      const userRecord = await auth.getUserByEmail(userData.email);
      createdUserIds[userData.userName] = userRecord.uid;
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        console.warn(
          `Skipping seed for ${userData.email} because the user does not exist in Firebase Auth.`
        );
      } else {
        console.error(`Failed to seed data for ${userData.email}:`, error);
      }
    }
  }

  // --- Seed Posts ---
  console.log('Seeding posts...');
  const DUMMY_POSTS = [
    {
      authorUserName: 'sara_paws',
      content: 'A beautiful day for a walk in the park.',
      imageUrl: 'https://images.unsplash.com/photo-1505628346881-b72b27e84530?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxkb2clMjBoaWtpbmd8ZW58MHx8fHwxNzY4MzA0MDUyfDA&ixlib=rb-4.1.0&q=80&w=1080',
      createdAt: Timestamp.now(),
      likes: [],
      commentCount: 0,
    },
    {
      authorUserName: 'arjun_and_luna',
      content: 'Just lounging around.',
      imageUrl: 'https://images.unsplash.com/photo-1574158622682-e40e69841006?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxjYXQlMjBpbiUyMGJveHxlbnwwfHx8fDE3NjgzMDQwNTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
      createdAt: Timestamp.fromMillis(Timestamp.now().toMillis() - 3600000), // 1 hour ago
      likes: [createdUserIds['sara_paws']],
      commentCount: 0,
    },
    {
      authorUserName: 'chen_walks_dogs',
      content: 'Treats for my good boys!',
      imageUrl: 'https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxkb2dzJTIwZWF0aW5nJTIwaWNlJTIwY3JlYW18ZW58MHx8fHwxNzY4MzA0MDU0fDA&ixlib=rb-4.1.0&q=80&w=1080',
      createdAt: Timestamp.fromMillis(Timestamp.now().toMillis() - 86400000), // 1 day ago
      likes: [createdUserIds['arjun_and_luna'], createdUserIds['priya_and_kiwi']],
      commentCount: 0,
    },
     {
      authorUserName: 'priya_and_kiwi',
      content: 'Enjoying the afternoon sun.',
      imageUrl: 'https://images.unsplash.com/photo-1452570053594-1b985d6ea890?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxwYXJha2VldCUyMG9uJTIwcGVyY2h8ZW58MHx8fHwxNzY4MzA0MDU1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      createdAt: Timestamp.fromMillis(Timestamp.now().toMillis() - 172800000), // 2 days ago
      likes: [],
      commentCount: 0,
    }
  ];

  for (const postData of DUMMY_POSTS) {
    const authorId = createdUserIds[postData.authorUserName];
    if (authorId) {
      const postRef = postsCollection.doc();
      await postRef.set({
        authorId: authorId,
        content: postData.content,
        imageUrl: postData.imageUrl,
        createdAt: postData.createdAt,
        likes: postData.likes,
        commentCount: postData.commentCount,
        id: postRef.id,
      });
      console.log(`  - Created post for user ${postData.authorUserName}`);
    }
  }

  // --- Seed Tips & Advice ---
  console.log('Seeding tips and advice...');
  const adviceCollection = firestore.collection('advicePosts');
  const DUMMY_TIPS = [
    {
        authorUserName: 'sara_paws',
        title: 'How to stop a dog from pulling on the leash?',
        content: "We've had great success with a front-clip harness. It gently redirects Max when he tries to pull, and our walks are so much more enjoyable now. Consistency is key!",
        createdAt: Timestamp.fromMillis(Timestamp.now().toMillis() - 3600000 * 5), // 5 hours ago
        upvotes: [createdUserIds['chen_walks_dogs']],
        downvotes: [],
        commentCount: 0,
    },
    {
        authorUserName: 'arjun_and_luna',
        title: 'Best way to introduce a new cat to your home?',
        content: "Start by keeping the new cat in a separate room for a few days with their own food, water, and litter box. This lets them get used to the sounds and smells of the house. Then, do scent swapping with blankets before letting them see each other.",
        createdAt: Timestamp.fromMillis(Timestamp.now().toMillis() - 86400000 * 3), // 3 days ago
        upvotes: [createdUserIds['sara_paws'], createdUserIds['priya_and_kiwi']],
        downvotes: [],
        commentCount: 0,
    },
    {
        authorUserName: 'chen_walks_dogs',
        title: 'My dog is scared of fireworks. What can I do?',
        content: "Create a safe, cozy den for them away from windows. Playing some calming music or white noise can also help drown out the sounds. A ThunderShirt has also worked wonders for our Beagle, Apollo.",
        createdAt: Timestamp.fromMillis(Timestamp.now().toMillis() - 86400000 * 7), // 7 days ago
        upvotes: [],
        downvotes: [],
        commentCount: 0,
    }
  ];

  for (const tipData of DUMMY_TIPS) {
    const authorId = createdUserIds[tipData.authorUserName];
    if (authorId) {
        const tipRef = adviceCollection.doc();
        await tipRef.set({
            authorId: authorId,
            title: tipData.title,
            content: tipData.content,
            createdAt: tipData.createdAt,
            upvotes: tipData.upvotes,
            downvotes: tipData.downvotes,
            commentCount: tipData.commentCount,
            id: tipRef.id
        });
        console.log(`  - Created tip "${tipData.title}"`);
    }
  }

  console.log('Database seeding complete!');
}

seedDatabase().catch((error) => {
  console.error('An unexpected error occurred during seeding:', error);
});
