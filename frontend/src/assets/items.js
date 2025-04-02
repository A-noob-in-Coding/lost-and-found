const items = [
  {
    id: 1,
    image: 'https://public.readdy.ai/ai/img_res/15c3648e6ca1c5fa7fcdcb8cabb6bf5f.jpg',
    title: 'Lost Black Leather Wallet',
    location: 'Central Park Library',
    date: '2025-03-28 14:30',
    user: {
      name: 'Emily Richardson',
      rollNumber: '23L-3059',
      avatar: 'https://public.readdy.ai/ai/img_res/5091d14ee72490aaaafccd7fc0386da1.jpg'
    },
    description: 'Lost my black leather wallet containing ID and credit cards. Last seen in the reading area.',
    type: 'Lost',
    comments: [
      {
        id: 1,
        user: {
          name: 'Alex Johnson',
          avatar: 'https://public.readdy.ai/ai/img_res/8b56d6dfb3c854d1b6a8b7e420cdde72.jpg',
          rollNumber: '21L-1234'
        },
        text: 'I think I saw a similar wallet in the cafeteria yesterday.',
        date: '2025-03-28 16:45'
      },
      {
        id: 2,
        user: {
          name: 'Maria Rodriguez',
          avatar: 'https://public.readdy.ai/ai/img_res/8bd5715f58098b75fd0c5fc5994efd4a.jpg',
          rollNumber: '22L-5678'
        },
        text: 'Did you check with the administration office? They usually keep lost items.',
        date: '2025-03-28 17:30'
      }
    ]
  },
  {
    id: 2,
    image: 'https://public.readdy.ai/ai/img_res/0c2e74dabd0c9849d53b92e3560b5ae1.jpg',
    title: 'Found AirPods Pro',
    location: 'Starbucks Downtown',
    date: '2025-03-28 12:15',
    user: {
      name: 'Michael Anderson',
      rollNumber: '22L-1045',
      avatar: 'https://public.readdy.ai/ai/img_res/8b2c71026ba0536b8239cbcfd6dab90a.jpg'
    },
    description: 'Found AirPods Pro in charging case on table near window.',
    type: 'Found',
    comments: []
  },
 
  {
    id: 3,
    image: 'https://public.readdy.ai/ai/img_res/0a95b17be43e9ddebc5fbae9d69bd388.jpg',
    title: 'Lost iPhone 14 Pro',
    location: 'City Gym',
    date: '2025-03-28 09:45',
    user: {
      name: 'Sarah Thompson',
      rollNumber: '19L-2011',
      avatar: 'https://public.readdy.ai/ai/img_res/ad84072cb83b04ba697da4b3a28b2843.jpg'
    },
    description: 'Lost my rose gold iPhone 14 Pro in the locker room area.',
    type: 'Lost',
    comments: []
  },
  {
    id: 4,
    image: 'https://public.readdy.ai/ai/img_res/083e604e1b5282bb41002af0f80885ec.jpg',
    title: 'Found Blue Backpack',
    location: 'University Library',
    date: '2025-03-27 16:20',
    user: {
      name: 'Daniel Martinez',
      rollNumber: '21L-5078',
      avatar: 'https://public.readdy.ai/ai/img_res/76195f8cebe24d0947f28ba424d86f7f.jpg'
    },
    description: 'Found a blue backpack with laptop and notebooks inside. Left at study table #14.',
    type: 'Found',
    comments: []
  },
  {
    id: 5,
    image: 'https://public.readdy.ai/ai/img_res/4d58d40bdcb8e2b050af5ba832345a6e.jpg',
    title: 'Lost Silver Watch',
    location: 'Campus Cafeteria',
    date: '2025-03-27 13:10',
    user: {
      name: 'Jennifer Wilson',
      rollNumber: '20L-3342',
      avatar: 'https://public.readdy.ai/ai/img_res/996230e5cc4b9e4a47b4d2116c700cc7.jpg'
    },
    description: 'Lost my silver wristwatch with brown leather strap. Has sentimental value.',
    type: 'Lost',
    comments: []
  },
  {
    id: 6,
    image: 'https://public.readdy.ai/ai/img_res/8be557914c1ed6494791fb2d2d5737ce.jpg',
    title: 'Found Car Keys',
    location: 'Student Center',
    date: '2025-03-26 18:45',
    user: {
      name: 'Robert Johnson',
      rollNumber: '22L-1987',
      avatar: 'https://public.readdy.ai/ai/img_res/78aa4e2d375297e3ab337d2935311da0.jpg'
    },
    description: 'Found car keys with a blue dolphin keychain near the vending machines.',
    type: 'Found',
    comments: []
  }
];

export default items