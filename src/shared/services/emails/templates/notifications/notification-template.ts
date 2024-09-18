import ejs from 'ejs';
import fs from 'fs';
import { INotificationTemplate } from '@/root/features/notifications/interfaces/notifcation.interface';

class NotificationTemplate {
  public notificationMessageTemplate(templateParams: INotificationTemplate): string {
    const { username, header, message } = templateParams;
    return ejs.render(fs.readFileSync(__dirname + '/notification.ejs', 'utf8'), {
      username,
      header,
      message,
      image_url:
        'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pngwing.com%2Fen%2Fsearch%3Fq%3Dlock&psig=AOvVaw3DXTuYbRuZ08JXRfYPYerO&ust=1721229504418000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCPjW-tvtq4cDFQAAAAAdAAAAABAE'
    });
  }
}

export const notificationTemplate: NotificationTemplate = new NotificationTemplate();
