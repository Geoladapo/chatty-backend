import mongoose, { Schema, Model, model } from 'mongoose';
import { IReactionDocument } from '../interfaces/reaction.interface';

const reactionSchema: Schema = new Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', index: true },
  type: { type: String, default: '' },
  username: { type: String, default: '' },
  avataColor: { type: String, default: '' },
  profilePicture: { type: String, default: '' },
  createdAt: { type: String, default: Date.now() }
});

const ReactionModel: Model<IReactionDocument> = model<IReactionDocument>('Reaction', reactionSchema, 'Reaction');

export { ReactionModel };
