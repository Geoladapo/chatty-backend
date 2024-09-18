import fs from 'fs';
import ejs from 'ejs';
import { IResetPasswordParams } from 'src/features/user/interfaces/user.interface';

class ResetPasswordTemplate {
  public passwordResetConfirmationTemplate(templateParams: IResetPasswordParams): string {
    const { username, email, ipaddress, date } = templateParams;
    return ejs.render(fs.readFileSync(__dirname + '/reset-password-template.ejs', 'utf8'), {
      username,
      email,
      ipaddress,
      date,
      image_url:
        'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pngwing.com%2Fen%2Fsearch%3Fq%3Dlock&psig=AOvVaw3DXTuYbRuZ08JXRfYPYerO&ust=1721229504418000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCPjW-tvtq4cDFQAAAAAdAAAAABAE'
    });
  }
}

export const resetPasswordTemplate: ResetPasswordTemplate = new ResetPasswordTemplate();
