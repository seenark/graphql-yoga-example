import { IComment, IPost } from './../db/db';
import { TResolvers } from './Query';

const commentSub: TResolvers<any, {postId:string}, AsyncIterator<IComment>> = (parent, args, ctx,info) => {
  const {pubsub, db} = ctx
  const { postId } = args
  const post = db.posts.find(post => post.id === postId && post.published)
  if (!post) throw new Error("not found post")

  return pubsub.asyncIterator<IComment>(`comment:${postId}`)
}

const postSub: TResolvers<any, {}, AsyncIterator<IPost>> = (parent, args, ctx, info) => {
  const {pubsub} = ctx

  return pubsub.asyncIterator('post')
} 

export default {
  comment: {
    subscribe: commentSub
  },
  post: {
    subscribe: postSub
  }
}