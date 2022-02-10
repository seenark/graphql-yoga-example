import { IPost, IUser } from './../db/db';
import db from '../db/db'
import { PubSub } from 'graphql-yoga';

export type TResolvers<TParent, TArgs, TReturn> = (parent:TParent, args: TArgs, ctx: {db: typeof db, pubsub: PubSub}, info:any) => TReturn

const Query = {
  users: ((parent, args, {db}, info) => {
    if (!args.query) {
      return db.users;
    }
    return db.users.filter((user) => {
      return user.name.toLowerCase().includes(args.query!.toLowerCase());
    });
  }) as TResolvers<any,{ query?: string }, IUser[] >,

  posts: ((parent, args, {db}, info) => {
    if (!args.query) {
      return db.posts;
    }
    return db.posts.filter((post) => {
      const isTitleMatch = post.title
        .toLowerCase()
        .includes(args.query!.toLowerCase());
      const isBodyMatch = post.body
        .toLowerCase()
        .includes(args.query!.toLowerCase());
      return isTitleMatch || isBodyMatch;
    });
  }) as TResolvers<any, { query?: string }, IPost[] >,
  comments: ((parent, args, {db}, info) => {
    return db.comments;
  }) as TResolvers<any,any,any >,
  me():IUser {
    return {
      id: "123456",
      name: "HadesGod",
      email: "hadesgod@mail.com",
      age: 29,
    };
  },
  post():IPost {
    return {
      id: "abc123",
      title: "God's Bookds",
      body: "HadesGod body",
      published: true,
    };
  },
}

export default Query