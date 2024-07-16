import HTTP_STATUS from 'http-status-codes';
import { Request, Response } from 'express';
import { config } from 'src/config';
import JWT from 'jsonwebtoken';
import { joiValidation } from 'src/shared/globals/decorators/joi-validation.decorators';
import { authService } from 'src/shared/services/db/auth.service';
import { BadRequestError } from 'src/shared/globals/helpers/error-handler';
import { loginSchema } from '../schemes/signin';
import { IAuthDocument } from '../interfaces/auth.interface';
import { IUserDocument } from 'src/features/user/interfaces/user.interface';
import { userService } from 'src/shared/services/db/user.service';

export class SignIn {
  @joiValidation(loginSchema)
  public async read(req: Request, res: Response): Promise<void> {
    const { username, password } = req.body;
    const existingUser: IAuthDocument = await authService.getAuthUserByUsername(username);
    if (!existingUser) {
      throw new BadRequestError('Invalid credentials');
    }

    const passwordMatch: boolean = await existingUser.comparePassword(password);
    if (!passwordMatch) {
      throw new BadRequestError('Invalid credentials');
    }

    const user: IUserDocument = await userService.getUserByAuthId(`${existingUser._id}`);

    const userJWT: string = JWT.sign(
      {
        userId: user._id,
        uId: existingUser.uId,
        email: existingUser.email,
        username: existingUser.username,
        avatarColor: existingUser.avatarColor
      },
      config.JWT_TOKEN!
    );

    req.session = { Jwt: userJWT };

    const userDocument: IUserDocument = {
      ...user,
      authId: existingUser!._id,
      username: existingUser!.username,
      email: existingUser!.email,
      avatarColor: existingUser!.avatarColor,
      uId: existingUser!.uId,
      createdAt: existingUser!.createdAt
    } as IUserDocument;
    res.status(HTTP_STATUS.OK).json({ message: 'User login successfully', user: userDocument, token: userJWT });
  }
}
