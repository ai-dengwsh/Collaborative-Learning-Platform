import mongoose from 'mongoose';

export interface ICourse extends mongoose.Document {
  title: string;
  description: string;
  instructor: mongoose.Types.ObjectId;
  students: mongoose.Types.ObjectId[];
  category: string;
  tags: string[];
  cover: string;
  materials: {
    title: string;
    type: string;
    url: string;
    uploadedAt: Date;
  }[];
  announcements: {
    title: string;
    content: string;
    createdAt: Date;
  }[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  category: {
    type: String,
    required: true,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  cover: {
    type: String,
    default: ''
  },
  materials: [{
    title: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  announcements: [{
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isPublished: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// 索引优化
courseSchema.index({ title: 'text', description: 'text' });
courseSchema.index({ category: 1 });
courseSchema.index({ tags: 1 });
courseSchema.index({ instructor: 1 });

export const Course = mongoose.model<ICourse>('Course', courseSchema); 