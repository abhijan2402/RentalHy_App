const sampleImages = [
    'https://upload.wikimedia.org/wikipedia/commons/a/a4/2019_Toyota_Corolla_Icon_Tech_VVT-i_Hybrid_1.8.jpg',
    'https://www.worldcoffeeportal.com/getattachment/a1fb8071-8708-48a5-879a-7f53d1775dd4/angelica-reyes-6xBvVSs2G8c-unsplash-(1).jpg.aspx?lang=en-GB&width=700&height=466',
    'https://theimperialtours.com/wp-content/uploads/2024/09/tajmahajnight.jpg',
    'https://images.healthshots.com/healthshots/en/uploads/2023/10/04172423/best-coffee-brands-2.jpg',
];

const getRandomImages = () => {
    const count = Math.floor(Math.random() * 4) + 1; // 1 to 8 images
    const images = [];
    for (let i = 0; i < count; i++) {
        const randomIndex = Math?.floor(Math.random() * sampleImages.length);
        images.push(sampleImages[randomIndex]);
    }
    return images;
};

export const fakePosts = [
    {
        id: '1',
        name: 'Emily Johnson',
        postTitle: 'Morning vibes ☀️',
        postImage: getRandomImages(),
        postTime: '2 hours ago',
        likeCount: 120,
        commentCount: 14,
        favourite: false,
        userProfileImage: 'https://randomuser.me/api/portraits/women/21.jpg',
        location: 'New York, USA',
    },
    {
        id: '2',
        name: 'David Kim',
        postTitle: 'City lights at night 🌃',
        postImage: getRandomImages(),
        postTime: '5 hours ago',
        likeCount: 342,
        commentCount: 38,
        favourite: true,
        userProfileImage: 'https://randomuser.me/api/portraits/men/44.jpg',
        location: 'Los Angeles, USA',
    },
    {
        id: '3',
        name: 'Sophia Lee',
        postTitle: 'Weekend getaway 💖',
        postImage: getRandomImages(),
        postTime: '1 day ago',
        likeCount: 510,
        commentCount: 65,
        favourite: false,
        userProfileImage: 'https://randomuser.me/api/portraits/women/32.jpg',
        location: 'Bali, Indonesia',
    },
    {
        id: '4',
        name: 'James Carter',
        postTitle: 'Coffee and code ☕💻',
        postImage: getRandomImages(),
        postTime: '30 minutes ago',
        likeCount: 89,
        commentCount: 12,
        favourite: false,
        userProfileImage: 'https://randomuser.me/api/portraits/men/56.jpg',
        location: 'San Francisco, USA',
    },
    {
        id: '5',
        name: 'Ava Thompson',
        postTitle: 'Hiking to the top! 🏞️',
        postImage: getRandomImages(),
        postTime: '3 days ago',
        likeCount: 470,
        commentCount: 44,
        favourite: true,
        userProfileImage: 'https://randomuser.me/api/portraits/women/45.jpg',
        location: 'Swiss Alps',
    },
    {
        id: '6',
        name: 'Liam Smith',
        postTitle: 'Lazy Sunday afternoon...',
        postImage: getRandomImages(),
        postTime: '4 hours ago',
        likeCount: 145,
        commentCount: 19,
        favourite: false,
        userProfileImage: 'https://randomuser.me/api/portraits/men/60.jpg',
        location: 'Toronto, Canada',
    },
    {
        id: '7',
        name: 'Mia Walker',
        postTitle: 'Art in motion 🎨',
        postImage: getRandomImages(),
        postTime: '6 hours ago',
        likeCount: 289,
        commentCount: 32,
        favourite: false,
        userProfileImage: 'https://randomuser.me/api/portraits/women/38.jpg',
        location: 'Paris, France',
    },
    {
        id: '8',
        name: 'Noah Anderson',
        postTitle: 'Gym time 💪',
        postImage: getRandomImages(),
        postTime: '1 hour ago',
        likeCount: 198,
        commentCount: 18,
        favourite: true,
        userProfileImage: 'https://randomuser.me/api/portraits/men/33.jpg',
        location: 'Miami, USA',
    },
    {
        id: '9',
        name: 'Isabella Martinez',
        postTitle: 'Foodie finds 🍜',
        postImage: getRandomImages(),
        postTime: '8 hours ago',
        likeCount: 322,
        commentCount: 28,
        favourite: true,
        userProfileImage: 'https://randomuser.me/api/portraits/women/50.jpg',
        location: 'Tokyo, Japan',
    },
    {
        id: '10',
        name: 'William Scott',
        postTitle: 'Throwback to this view 😍',
        postImage: getRandomImages(),
        postTime: '2 days ago',
        likeCount: 390,
        commentCount: 49,
        favourite: false,
        userProfileImage: 'https://randomuser.me/api/portraits/men/77.jpg',
        location: 'Santorini, Greece',
    },
];



export const ExploreEvent = [
    {
        id: 1,
        username: 'john doe',
        profileImage: 'https://randomuser.me/api/portraits/men/1.jpg',
        location: 'New York City',
        invited: 120,
        joined: 75,
        eventImages: [
            'https://static.vecteezy.com/system/resources/thumbnails/041/388/388/small/ai-generated-concert-crowd-enjoying-live-music-event-photo.jpg',
            'https://media.istockphoto.com/id/479977238/photo/table-setting-for-an-event-party-or-wedding-reception.jpg?s=612x612&w=0&k=20&c=yIKLzW7wMydqmuItTTtUGS5cYTmrRGy0rXk81AltdTA=',
            'https://marketing-cdn.tickettailor.com/ZgP1j7LRO5ile62O_HowdoyouhostasmallcommunityeventA10-stepguide%2CMiniflagsattheevent.jpg?auto=format,compress',
        ],
        description:
            'Join us for an amazing rooftop party with live music and drinks!',
        dateTime: '2025-05-15 7:00 PM',
    },
    {
        id: 2,
        username: 'jane smith',
        profileImage: 'https://randomuser.me/api/portraits/women/2.jpg',
        location: 'Los Angeles',
        invited: 80,
        joined: 60,
        eventImages: [
            'https://media.istockphoto.com/id/479977238/photo/table-setting-for-an-event-party-or-wedding-reception.jpg?s=612x612&w=0&k=20&c=yIKLzW7wMydqmuItTTtUGS5cYTmrRGy0rXk81AltdTA=',
            'https://static.vecteezy.com/system/resources/thumbnails/041/388/388/small/ai-generated-concert-crowd-enjoying-live-music-event-photo.jpg',
            'https://marketing-cdn.tickettailor.com/ZgP1j7LRO5ile62O_HowdoyouhostasmallcommunityeventA10-stepguide%2CMiniflagsattheevent.jpg?auto=format,compress',
        ],
        description:
            'Sunset yoga session at the beach, followed by a healthy brunch!',
        dateTime: '2025-05-16 6:00 AM',
    },
    {
        id: 3,
        username: 'michael brown',
        profileImage: 'https://randomuser.me/api/portraits/men/3.jpg',
        location: 'Chicago',
        invited: 200,
        joined: 150,
        eventImages: [
            'https://marketing-cdn.tickettailor.com/ZgP1j7LRO5ile62O_HowdoyouhostasmallcommunityeventA10-stepguide%2CMiniflagsattheevent.jpg?auto=format,compress',
            'https://static.vecteezy.com/system/resources/thumbnails/041/388/388/small/ai-generated-concert-crowd-enjoying-live-music-event-photo.jpg',
            'https://media.istockphoto.com/id/479977238/photo/table-setting-for-an-event-party-or-wedding-reception.jpg?s=612x612&w=0&k=20&c=yIKLzW7wMydqmuItTTtUGS5cYTmrRGy0rXk81AltdTA=',
        ],
        description:
            'Networking event for young entrepreneurs. Drinks and snacks provided.',
        dateTime: '2025-05-20 5:00 PM',
    },
];