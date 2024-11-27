import mongoose, { Document } from 'mongoose';
import { IUser } from './User';

export interface IMessage extends Document {
  content: string;
  sender: IUser['_id'];
  attachments?: {
    url: string;
    public_id: string;
    name: string;
  }[];
  createdAt: Date;
}

export interface IChatRoom extends Document {
  name: string;
  courseId: mongoose.Types.ObjectId;
  participants: IUser['_id'][];
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  attachments: [{
    url: String,
    public_id: String,
    name: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const chatRoomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  messages: [messageSchema]
}, {
  timestamps: true
});

// 索引优化
chatRoomSchema.index({ courseId: 1 });
chatRoomSchema.index({ participants: 1 });
chatRoomSchema.index({ 'messages.sender': 1 });
chatRoomSchema.index({ createdAt: 1 });

export const ChatRoom = mongoose.model<IChatRoom>('ChatRoom', chatRoomSchema); 