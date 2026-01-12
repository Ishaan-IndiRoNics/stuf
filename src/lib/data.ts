export const currentUser = {
  name: 'Alex Doe',
  avatarUrl: 'https://picsum.photos/seed/user1/100/100',
  handle: '@alexdoe',
  bio: 'Lover of all things furry. Proud parent to a golden retriever named Sunny.',
  pets: [
    {
      name: 'Sunny',
      breed: 'Golden Retriever',
      age: '3 years',
      imageUrl: 'https://picsum.photos/seed/pet1/400/400',
      imageHint: 'golden retriever',
      bio: 'A happy-go-lucky retriever who loves long walks and chasing squirrels.',
    },
  ],
};

export const posts = [
  {
    id: 1,
    user: {
      name: 'Jane Smith',
      avatarUrl: 'https://picsum.photos/seed/user2/100/100',
    },
    timeAgo: '2 hours ago',
    content: 'Sunny days are for the park! 🌳☀️',
    imageUrl: 'https://picsum.photos/seed/pet1/600/600',
    imageHint: 'golden retriever',
    likes: 124,
    comments: 12,
  },
  {
    id: 2,
    user: {
      name: 'Carlos Gomez',
      avatarUrl: 'https://picsum.photos/seed/user3/100/100',
    },
    timeAgo: '5 hours ago',
    content: "Someone's found the perfect sunbeam for a nap. 😴",
    imageUrl: 'https://picsum.photos/seed/pet2/600/600',
    imageHint: 'calico cat',
    likes: 250,
    comments: 34,
  },
  {
    id: 3,
    user: {
      name: 'Aisha Khan',
      avatarUrl: 'https://picsum.photos/seed/user4/100/100',
    },
    timeAgo: '1 day ago',
    content: "Beach zoomies are the best zoomies. Look at him go!",
    imageUrl: 'https://picsum.photos/seed/pet3/600/600',
    imageHint: 'black labrador',
    likes: 489,
    comments: 56,
  },
];

export const conversations = [
  {
    id: 1,
    user: {
      name: 'Jane Smith',
      avatarUrl: 'https://picsum.photos/seed/user2/100/100',
    },
    lastMessage: 'Hey! I saw you at the dog park earlier. Sunny is so cute!',
    timestamp: '10:42 AM',
    unread: 2,
  },
  {
    id: 2,
    user: {
      name: 'Carlos Gomez',
      avatarUrl: 'https://picsum.photos/seed/user3/100/100',
    },
    lastMessage: 'Your cat is gorgeous! What breed is she?',
    timestamp: 'Yesterday',
    unread: 0,
  },
  {
    id: 3,
    user: {
      name: 'Aisha Khan',
      avatarUrl: 'https://picsum.photos/seed/user4/100/100',
    },
    lastMessage: 'Haha, thanks! He loves the water.',
    timestamp: '2 days ago',
    unread: 0,
  },
];

export const messages = [
    { id: 1, sender: 'Jane Smith', text: "Hey! I saw you at the dog park earlier. Sunny is so cute!", timestamp: "10:30 AM" },
    { id: 2, sender: 'You', text: "Oh, thank you! Your dog is adorable too. What's their name?", timestamp: "10:31 AM" },
    { id: 3, sender: 'Jane Smith', text: "This is Buster. He's a beagle mix.", timestamp: "10:32 AM" },
    { id: 4, sender: 'Jane Smith', text: "We should arrange a playdate for them sometime!", timestamp: "10:32 AM" },
];
