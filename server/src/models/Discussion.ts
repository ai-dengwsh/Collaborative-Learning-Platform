import mongoose from 'mongoose';

export interface IDiscussion extends mongoose.Document {
  title: string;
  content: string;
  course: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  replies: {
    content: string;
    author: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
    likes: mongoose.Types.ObjectId[];
  }[];
  tags: string[];
  likes: mongoose.Types.ObjectId[];
  isAnnouncement: boolean;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const discussionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 5000
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  replies: [{
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  }],
  tags: [{
    type: String,
    trim: true
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isAnnouncement: {
    type: Boolean,
    default: false
  },
  isPinned: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// 索引优化
discussionSchema.index({ course: 1 });
discussionSchema.index({ author: 1 });
discussionSchema.index({ tags: 1 });
discussionSchema.index({ title: 'text', content: 'text' });

export const Discussion = mongoose.model<IDiscussion>('Discussion', discussionSchema); 