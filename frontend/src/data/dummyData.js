// Dummy data for preview page when there are less than 6 posts
export const dummyPosts = [
  {
    id: "dummy-1",
    title: "Black Leather Wallet",
    description: "Found near the main library entrance",
    location: "Main Library",
    campus: "Lahore Campus",
    time: "2 hours ago",
    type: "Found",
    image: "/fast_nuces.png",
    badge: "Found"
  },
  {
    id: "dummy-2", 
    title: "Keys with University Keychain",
    description: "Lost somewhere in the cafeteria area",
    location: "Cafeteria",
    campus: "Karachi Campus",
    time: "4 hours ago",
    type: "Lost",
    image: "/no_prev_img.png",
    badge: "Lost"
  },
  {
    id: "dummy-3",
    title: "Blue Notebook",
    description: "Found in Computer Science Department",
    location: "CS Department", 
    campus: "Islamabad Campus",
    time: "6 hours ago",
    type: "Found",
    image: "/fast_nuces.png",
    badge: "Found"
  },
  {
    id: "dummy-4",
    title: "Black Backpack",
    description: "Lost near the parking area",
    location: "Parking Area",
    campus: "Lahore Campus",
    time: "8 hours ago",
    type: "Lost",
    image: "/no_prev_img.png",
    badge: "Lost"
  },
  {
    id: "dummy-5",
    title: "White Earphones",
    description: "Found in the gymnasium locker room",
    location: "Gymnasium",
    campus: "Peshawar Campus",
    time: "12 hours ago",
    type: "Found",
    image: "/fast_nuces.png",
    badge: "Found"
  },
  {
    id: "dummy-6",
    title: "Red Water Bottle",
    description: "Lost during the morning lecture",
    location: "Lecture Hall 1",
    campus: "Chiniot-Faisalabad Campus",
    time: "1 day ago",
    type: "Lost",
    image: "/no_prev_img.png",
    badge: "Lost"
  }
];

// Function to format time ago from date
export const formatTimeAgo = (dateString) => {
  const now = new Date();
  const postDate = new Date(dateString);
  const diffInMs = now - postDate;
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInHours < 1) {
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
  } else {
    return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
  }
};

// Function to transform API data to match preview page format
export const transformApiDataToPreviewFormat = (apiPost) => {
  return {
    id: apiPost.id,
    title: apiPost.title,
    description: apiPost.description,
    location: apiPost.location,
    campus: apiPost.campus,
    time: formatTimeAgo(apiPost.date),
    type: apiPost.type,
    image: apiPost.image || "/no_prev_img.png", // fallback image
    badge: apiPost.type
  };
};