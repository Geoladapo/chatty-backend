import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';
import { IFileImageDocument } from '../interfcaes/image.interfcae';
import { imageService } from '@/service/db/image.service';

export class Get {
  public async images(req: Request, res: Response): Promise<void> {
    const images: IFileImageDocument[] = await imageService.getImages(req.params.userId);
    res.status(HTTP_STATUS.OK).json({ message: 'User images', images });
  }
}
