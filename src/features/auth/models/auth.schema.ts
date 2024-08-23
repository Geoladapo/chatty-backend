import { hash, compare } from 'bcryptjs';
import { IAuthDocument } from '../interfaces/auth.interface';
import { model, Model, Schema } from 'mongoose';

const SALT_ROUND = 10;

const authSchema: Schema = new Schema(
  {
    username: { type: String },
    uId: { type: String },
    email: { type: String },
    password: { type: String },
    avatarColor: { type: String },
    createdAt: { type: Date, default: Date.now },
    passwordResetToken: { type: String, default: '' },
    passwordResetExpires: { type: Number }
  },
  {
    // This is used to delete the password if the document is called
    toJSON: {
      transform(_doc, ret) {
        delete ret.password;
        return ret;
      }
    }
  }
);

// This method will be used if the document is created for the first time
authSchema.pre('save', async function (this: IAuthDocument, next: () => void) {
  const hashedPassword: string = await hash(this.password as string, SALT_ROUND);
  this.password = hashedPassword;
  next();
});

// This method is used to compare the password against the current password
authSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  const hashedPassword: string = (this as unknown as IAuthDocument).password!;
  return compare(password, hashedPassword);
};

// Use this method when the user is performing changed password or user is updating their password
authSchema.methods.hashPassword = async function (password: string): Promise<string> {
  return hash(password, SALT_ROUND);
};

const AuthModel: Model<IAuthDocument> = model<IAuthDocument>('Auth', authSchema, 'Auth');
export { AuthModel };
