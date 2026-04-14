import { API_URL } from "../environment";

export const API_CONFIG = {
  baseUrl: `${API_URL}`,
  path: {
    login: "admin/signin",
    profile: "admin/profile",
    dashboardState: "admin/dashboard/state",
    users: "admin/user-list",
    addUser: "admin/add-user",
    sendVerificationLink: "admin/send-user-verification",
    blockUser: "admin/user-block",
    unblockUser: "admin/user-unblock",
    addBlogs: "admin/addBlog",
    categories: "categories",
    tags: "tags",
    allVersion: "setting/version",
    news: "news",
    social: "social-media",
    blogs: "admin/blogs",
    sendImage: "admin/sendImage",
  },
};

export const notifications = [
  {
    id: 1,
    title: "Blog",
    desc: "Admin has added new blog",
    date: "22/06/2023",
    time: "11:29 PM",
    seen: true,
  },
  {
    id: 2,
    title: "News",
    desc: "Admin has added news",
    date: "22/06/2023",
    time: "11:29 PM",
    seen: false,
  },
  {
    id: 3,
    title: "Story",
    desc: "Admin has added a new story",
    date: "22/06/2023",
    time: "11:29 PM",
    seen: false,
  },
  {
    id: 5,
    title: "Blog",
    desc: "Admin has added new blog",
    date: "22/06/2023",
    time: "11:29 PM",
    seen: true,
  },
  {
    id: 6,
    title: "News",
    desc: "Admin has added news",
    date: "22/06/2023",
    time: "11:29 PM",
    seen: false,
  },
  {
    id: 7,
    title: "Blog",
    desc: "Admin has added new blog",
    date: "22/06/2023",
    time: "11:29 PM",
    seen: false,
  },
];

export const TAGS = {
  inactive: "InActive",
  active: "Active",
  blocked: "Blocked",
};
