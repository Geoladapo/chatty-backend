import fs from 'fs';
import ejs from 'ejs';

class ForgotPasswordTemplate {
  public passwordResetTemplate(username: string, resetLink: string): string {
    return ejs.render(fs.readFileSync(__dirname + '/forgot-password-templates.ejs', 'utf8'), {
      username,
      resetLink,
      image_url:
        'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pngwing.com%2Fen%2Fsearch%3Fq%3Dlock&psig=AOvVaw3DXTuYbRuZ08JXRfYPYerO&ust=1721229504418000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCPjW-tvtq4cDFQAAAAAdAAAAABAE'
    });
  }
}

export const forgotPasswordTemplate: ForgotPasswordTemplate = new ForgotPasswordTemplate();
