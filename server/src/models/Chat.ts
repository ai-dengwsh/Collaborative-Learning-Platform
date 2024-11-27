import mongoose, { Schema, Document, Types } from 'mongoose';

interface IAttachment {
  url: string;
  public_id: string;
  name: string;
}

interface IMessage {
  content: string;
  sender: Types.ObjectId;
  attachments?: IAttachment[];
  createdAt: Date;
}

export interface IChat extends Document {
  title: string;
  course: Types.ObjectId;
  participants: Types.ObjectId[];
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const attachmentSchema = new Schema({
  url: { type: String, required: true },
  public_id: { type: String, required: true },
  name: { type: String, required: true }
});

const messageSchema = new Schema({
  content: { type: String, required: true },
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  attachments: [attachmentSchema],
  createdAt: { type: Date, default: Date.now }
});

const chatSchema = new Schema({
  title: { type: String, required: true },
  course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  messages: [messageSchema]
}, {
  timestamps: true
});

// 索引优化
chatSchema.index({ course: 1 });
chatSchema.index({ participants: 1 });
chatSchema.index({ createdAt: -1 });

export const Chat = mongoose.model<IChat>('Chat', chatSchema); 