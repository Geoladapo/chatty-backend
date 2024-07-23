import HTTP_STATUS from 'http-status-codes';
import { Request, Response } from 'express';

import JWT from 'jsonwebtoken';
import moment from 'moment';
import publicIP from 'ip';
import { config } from '@/root/config';
import { joiValidation } from '@/root/shared/globals/decorators/joi-validation.decorators';
import { loginSchema } from '../schemes/signin';
import { IAuthDocument } from '../interfaces/auth.interface';
import { authService } from '@/service/db/auth.service';
import { BadRequestError } from '@/root/shared/globals/helpers/error-handler';
import { IResetPasswordParams, IUserDocument } from '@/user/interfaces/user.interface';
import { userService } from '@/service/db/user.service';
import { emailQueue } from '@/service/queues/email.queue';
import { resetPasswordTemplate } from '@/service/emails/templates/reset-password/reset-password-template';

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

    const templateParams: IResetPasswordParams = {
      username: existingUser.username!,
      email: existingUser.email!,
      ipaddress: publicIP.address(),
      date: moment().format('DD/MM/YYYY HH:mm:ss')
    };

    const template: string = resetPasswordTemplate.passwordResetConfirmationTemplate(templateParams);
    emailQueue.addEmailJob('forgotPasswordEmail', {
      template,
      receiverEmail: 'kaleigh.watsica@ethereal.email',
      subject: 'Password reset confirmation '
    });

    req.session = { jwt: userJWT };

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
