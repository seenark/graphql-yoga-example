import { IUser, IPost } from './../db/db';
import { TResolvers } from './Query';
import { IComment } from "../db/db";

const Comment = {
  
    author: (
      (parent, args, {db}, info) => {
        return db.users.find((user) => user.id === parent.author);
      }
    ) as TResolvers<IComment, {}, IUser>,
    post: (
      (parent: IComment, args, {db}, info) => {
        return db.posts.find((post) => post.id === parent.post);
      }
    ) as TResolvers<IComment, {}, IPost>,
}

export default Comment