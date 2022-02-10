import { IPostUpdate } from "./../db/db";
import { TResolvers } from "./Query";
import { v4 } from "uuid";
import { IComment, IPost, IUser, IUserUpdate } from "../db/db";

const Mutation = {
  createUser: ((parent, args, { db }, info): IUser => {
    /** check is this email exist */
    const emailTaken = db.users.some((user) => user.email === args.data.email);
    if (emailTaken) {
      throw new Error("this email already taken.");
    }
    const user = {
      id: v4(),
      ...args.data,
    };
    db.users.push(user);
    return user;
  }) as TResolvers<
    any,
    { data: { name: string; email: string; age: number } },
    IUser
  >,

  deleteUser: ((parent, args, { db }, info) => {
    const userIndex = db.users.findIndex((user) => user.id === args.id);
    if (userIndex < 0) throw new Error("Not found user");
    const deletedUsers = db.users.splice(userIndex, 1);

    db.posts = db.posts.filter((post) => {
      const match = post.author === args.id;
      if (match) {
        db.comments = db.comments.filter((comment) => comment.post !== post.id);
      }

      return !match;
    });
    db.comments = db.comments.filter((comment) => comment.author !== args.id);
    return deletedUsers[0];
  }) as TResolvers<any, { id: string }, IUser>,

  updateUser: ((parent, args, ctx, info) => {
    const { id, data } = args;
    const { db } = ctx;
    const find = db.users.find((user) => user.id === id);
    if (!find) throw new Error("user not found");
    if (data.email) {
      const emailTaken = db.users.some((user) => user.email === data.email);
      if (emailTaken) {
        throw new Error("Email already taken by someone");
      }
      find.email = data.email;
    }
    if (data.name) find.name = data.name;
    if (data.age || data.age === null) find.age = data.age;
    return find;
  }) as TResolvers<{}, { id: string; data: IUserUpdate }, IUser>,

  createPost: ((parent, args, { db, pubsub }, info): IPost => {
    /** check if user exist can create the post */
    const userExist = db.users.some((user) => user.id === args.data.author);
    if (!userExist) {
      throw new Error("user does not exist");
    }
    const post = {
      id: v4(),
      ...args.data,
    };
    db.posts.push(post);

    if (post.published) {
      pubsub.publish("post", {
        post: {
          mutation: "CREATED",
          data: post,
        },
      });
    }

    return post;
  }) as TResolvers<
    any,
    {
      data: {
        title: string;
        body: string;
        published: boolean;
        author: string;
      };
    },
    IPost
  >,
  deletePost: ((parent, args, { db, pubsub }, info): IPost => {
    const postIndex = db.posts.findIndex((post) => post.id === args.id);
    if (postIndex < 0) throw new Error("Not found Post");
    const deletedPosts = db.posts.splice(postIndex, 1);
    db.comments = db.comments.filter((comment) => comment.post !== args.id);

    if (deletedPosts[0].published) {
      pubsub.publish("post", {
        post: {
          mutaion: "DELETED",
          data: deletedPosts[0],
        },
      });
    }

    return deletedPosts[0];
  }) as TResolvers<any, { id: string }, IPost>,
  updatePost: ((parent, args, ctx, info) => {
    const { db, pubsub } = ctx;
    const { id, data } = args;
    const post = db.posts.find((post) => post.id === id);
    if (!post) throw new Error("Not found Post");
    const originalPost: IPost = { ...post };

    if (data.title) post.title = data.title;
    if (data.body) post.body = data.body;
    if (data.published !== undefined) post.published = data.published;

    if (data.published && originalPost.published) {
      // update
      post.published = data.published;
      pubsub.publish("post", {
        post: {
          mutation: "UPDATED",
          data: post,
        },
      });
    } else if (!data.published && originalPost.published) {
      // delete
      pubsub.publish("post", {
        post: {
          mutation: "DELETED",
          data: originalPost,
        },
      });
    } else if (data.published && !originalPost.published) {
      // create
      post.published = data.published;
      pubsub.publish("post", {
        post: {
          mutation: "CREATED",
          data: post,
        },
      });
    }
    return post;
  }) as TResolvers<any, { id: string; data: IPostUpdate }, IPost>,

  createComment: ((parent, args, { db, pubsub }, info): IComment => {
    /** check is user exist */
    const userExist = db.users.some((user) => user.id === args.data.author);
    if (!userExist) throw new Error("user does not exist");
    /** check is post exist and published is true */
    const postExist = db.posts.some((post) => {
      return post.id === args.data.post && post.published === true;
    });
    if (!postExist) throw new Error("post does not exist or post unpublished");
    const comment = {
      id: v4(),
      ...args.data,
    };
    db.comments.push(comment);
    pubsub.publish(`comment:${args.data.post}`, {
      comment: {
        mutation: "CREATED",
        data: comment,
      },
    });
    return comment;
  }) as TResolvers<
    any,
    { data: { post: string; author: string; text: string } },
    IComment
  >,
  deleteComment: ((parent, args, { db, pubsub }, info): IComment => {
    const commentIndex = db.comments.findIndex(
      (comment) => comment.id === args.id
    );
    if (commentIndex < 0) throw new Error("not found Comment");
    const [deletedComment] = db.comments.splice(commentIndex, 1);
    console.log("🚀 ~ file: Mutation.ts ~ line 183 ~ deletedComment", deletedComment)
    pubsub.publish(`comment:${deletedComment.post}`, {
      comment: {
        mutation: "DELETED",
        data: deletedComment,
      },
    });
    return deletedComment;
  }) as TResolvers<any, { id: string }, IComment>,
  updateComment: ((parent, args, ctx, info) => {
    const { id, text } = args;
    const { db, pubsub } = ctx;
    const find = db.comments.find((c) => c.id === id);
    if (!find) throw new Error("Not found comment");
    find.text = text;
    console.log('find', find)
    pubsub.publish(`comment:${find.post}`, {
      comment: {
        mutation: "UPDATEDd",
        data: find,
      },
    });
    return find;
  }) as TResolvers<any, { id: string; text: string }, IComment>,
};

export default Mutation;
