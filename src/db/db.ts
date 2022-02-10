
export interface IUser {
  id: string;
  name: string;
  email: string;
  age?: number;
}

export interface IUserUpdate {
  name?: string;
  email?: string;
  age?: number;
}
// Demo User
let users: IUser[] = [
  {
    id: "1",
    name: "HadesGod",
    email: "hadesgod@email.com",
    age: 30,
  },
  {
    id: "2",
    name: "TitonGod",
    email: "TitonGod@email.com",
  },
  {
    id: "3",
    name: "Kratos",
    email: "Kratos@email.com",
  },
];

export interface IPost {
  id: string;
  title: string;
  body: string;
  published: boolean;
  author?: string;
}

export interface IPostUpdate{
  title?: string;
  body?: string;
  published?: boolean;
}
// Demo Posts
let posts: IPost[] = [
  {
    id: "1",
    title: "Macbook Pro 2020 SoC M1",
    body: "This is the fastest notebook with ARM Chip",
    published: true,
    author: "1",
  },
  {
    id: "2",
    title: "iPhone12 Pro Max",
    body: "This is the fastest iphone apple ever made",
    published: true,
    author: "1",
  },
  {
    id: "3",
    title: "iPad Pro 2020",
    body: "This is the largest iPad size apple made",
    published: false,
    author: "2",
  },
];

export interface IComment {
  id: string;
  text: string;
  author: string;
  post: string;
}
// Demo Comments

export interface IUpdateComment {
  text?: string;
  author?: string;
  post?: string;
}

let comments = [
  {
    id: "c1",
    text: "Accusam sit tempor diam consetetur.",
    author: "1",
    post: "3",
  },
  {
    id: "c2",
    text: "Et amet ipsum sed dolore kasd labore, at lorem et.",
    author: "1",
    post: "2",
  },
  {
    id: "c3",
    text: "He upon coffined ancient beyond bliss talethis the of. By.",
    author: "2",
    post: "2",
  },
  {
    id: "c4",
    text: "Schatten mein das menge versuch irrt und herz,.",
    author: "3",
    post: "1",
  },
];

export default {
  users,
  comments,
  posts
}