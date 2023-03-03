import express from 'express';
import { celebrate } from 'celebrate';
import {
  PostController,
  PostCommentController,
  LikesController,
} from '../../../controllers';
import { postValidator, postCommentValidator } from './validators';
import {
  checkAuth,
  asyncHandler,
  checkPost,
  checkPostComment,
  checkPostAndJob,
} from '../../../middlewares';

const router = express.Router();

router
  .route('/')
  .post(
    checkAuth,
    celebrate({ body: postValidator.createPost }),
    asyncHandler(PostController.createPost),
  )
  .get(asyncHandler(PostController.getPosts));

router
  .route('/:postSlug')
  .all(checkPost)
  .get(asyncHandler(PostController.getPost))
  .put(
    checkAuth,
    celebrate({ body: postValidator.updatePost }),
    asyncHandler(PostController.updatePost),
  )
  .delete(checkAuth, asyncHandler(PostController.deletePost));

/* 
  Post comment routes
*/

router
  .route('/:postSlug/comments')
  .all(checkPost)
  .post(
    checkAuth,
    celebrate({ body: postCommentValidator.createPostComment }),
    asyncHandler(PostCommentController.createPostComment),
  )
  .get(asyncHandler(PostCommentController.getAllPostComments));

router
  .route('/:postSlug/comments/:postCommentId')
  .all(checkAuth, checkPost, asyncHandler(checkPostComment))
  .put(
    celebrate({ body: postCommentValidator.updatePostComment }),
    asyncHandler(PostCommentController.updatePostComment),
  )
  .delete(asyncHandler(PostCommentController.deletePostComment));
router
  .route('/:postSlug/like')
  .post(checkAuth, checkPost, asyncHandler(LikesController.likePost))
  .delete(checkAuth, checkPost, asyncHandler(LikesController.unlikePost));
router
  .route('/:postSlug/share/:plateforme')
  .post(
    checkAuth,
    celebrate({ params: postValidator.sharePost }),
    checkPostAndJob,
    asyncHandler(PostController.sharePost),
  );

export default router;
