import { authUserPayload } from '@/root/mocks/auth.mocks';
import { fileDocumentMock, imagesMockRequest, imagesMockResponse } from '@/root/mocks/image.mock';
import { imageService } from '@/service/db/image.service';
import { Request, Response } from 'express';
import { Get } from '../get-images';

jest.useFakeTimers();

describe('Get', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it('should send correct json response', async () => {
    const req: Request = imagesMockRequest({}, {}, authUserPayload, { imageId: '12345' }) as Request;
    const res: Response = imagesMockResponse();
    jest.spyOn(imageService, 'getImages').mockResolvedValue([fileDocumentMock]);

    await Get.prototype.images(req, res);
    expect(imageService.getImages).toHaveBeenCalledWith(req.params.userId);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'User images',
      images: [fileDocumentMock]
    });
  });
});
