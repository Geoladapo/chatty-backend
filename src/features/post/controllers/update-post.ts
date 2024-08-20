import HTTP_STATUS from 'http-status-codes';
import { Request, Response } from 'express';
import { PostCache } from '@/service/redis/post.cache';
import { socketIOPostObject } from '@/socket/post.socket';
import { postQueue } from '@/service/queues/post.queue';
import { IPostDocument } from '../interfaces/post.interface';
import { joiValidation } from '@/root/shared/globals/decorators/joi-validation.decorators';
import { postSchema, postWithImageSchema, postWithVideoSchema } from '../schemes/post.scheme';
import { UploadApiResponse } from 'cloudinary';
import { uploads } from '@/root/shared/globals/helpers/cloudinary-upload';
import { BadRequestError } from '@/root/shared/globals/helpers/error-handler';
import { imageQueue } from '@/service/queues/image.queue';

const postCache: PostCache = new PostCache();

export class Update {
  @joiValidation(postSchema)
  public async posts(req: Request, res: Response): Promise<void> {
    const { post, bgColor, feelings, privacy, gifUrl, imgVersion, imgId, profilePicture } = req.body;
    const { postId } = req.params;
    const updatedPost: IPostDocument = {
      post,
      bgColor,
      privacy,
      feelings,
      gifUrl,
      profilePicture,
      imgId,
      imgVersion,
      videoId: '',
      videoVersion: ''
    } as IPostDocument;

    const postUpdated: IPostDocument = await postCache.updatePostInCache(postId, updatedPost);
    socketIOPostObject.emit('update post', postUpdated, 'posts');
    postQueue.addPostJob('updatePostInDB', { key: postId, value: postUpdated });
    res.status(HTTP_STATUS.OK).json({ message: 'Post updated successfully' });
  }

  @joiValidation(postWithImageSchema)
  public async postWithImage(req: Request, res: Response): Promise<void> {
    const { imgId, imgVersion } = req.body;
    if (imgId && imgVersion) {
      Update.prototype.updatedPostWithImage(req);
    } else {
      const result: UploadApiResponse = await Update.prototype.addImageToExistingPost(req);
      if (!result.public_id) {
        throw new BadRequestError(result.message);
      }
    }
    res.status(HTTP_STATUS.OK).json({ message: 'Post with image updated successfully' });
  }

  // @joiValidation(postWithVideoSchema)
  // public async postWithVideo(req: Request, res: Response): Promise<void> {
  //   const { videoId, videoVersion } = req.body;
  //   if (videoId && videoVersion) {
  //     Update.prototype.updatePost(req);
  //   } else {
  //     const result: UploadApiResponse = await Update.prototype.addImageToExistingPost(req);
  //     if (!result.public_id) {
  //       throw new BadRequestError(result.message);
  //     }
  //   }
  //   res.status(HTTP_STATUS.OK).json({ message: 'Post with video updated successfully' });
  // }

  private async updatedPostWithImage(req: Request): Promise<void> {
    const { post, bgColor, feelings, privacy, gifUrl, imgVersion, imgId, profilePicture } = req.body;
    const { postId } = req.params;
    const updatedPost: IPostDocument = {
      post,
      bgColor,
      privacy,
      feelings,
      gifUrl,
      profilePicture,
      imgId: imgId ? imgId : '',
      imgVersion: imgVersion ? imgVersion : ''
    } as IPostDocument;

    const postUpdated: IPostDocument = await postCache.updatePostInCache(postId, updatedPost);
    socketIOPostObject.emit('update post', postUpdated, 'posts');
    postQueue.addPostJob('updatePostInDB', { key: postId, value: postUpdated });
  }

  private async addImageToExistingPost(req: Request): Promise<UploadApiResponse> {
    const { post, bgColor, feelings, privacy, gifUrl, profilePicture, image } = req.body;
    const { postId } = req.params;
    const result: UploadApiResponse = (await uploads(image)) as UploadApiResponse;

    if (!result?.public_id) {
      return result;
    }

    const updatedPost: IPostDocument = {
      post,
      bgColor,
      privacy,
      feelings,
      gifUrl,
      profilePicture,
      imgId: image ? result.public_id : '',
      imgVersion: image ? result.version.toString() : ''
    } as IPostDocument;

    const postUpdated: IPostDocument = await postCache.updatePostInCache(postId, updatedPost);
    socketIOPostObject.emit('update post', postUpdated, 'posts');
    postQueue.addPostJob('updatePostInDB', { key: postId, value: postUpdated });

    // call image queue to add image to mongo Database
    imageQueue.addImageJob('addImageToDB', {
      key: `${req.currentUser!.username}`,
      imgId: result.public_id,
      imgVersion: result.version.toString()
    });

    return result;
  }
}
