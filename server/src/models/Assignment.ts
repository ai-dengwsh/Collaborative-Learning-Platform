import mongoose, { Schema, Document, Types } from 'mongoose';

interface ISubmission {
  _id?: Types.ObjectId;
  student: Types.ObjectId;
  content: string;
  attachments: string[];
  submittedAt: Date;
  grade?: number;
  feedback?: string;
}

export interface IAssignment extends Document {
  title: string;
  description: string;
  course: Types.ObjectId;
  dueDate: Date;
  points: number;
  submissions: ISubmission[];
}

const submissionSchema = new Schema({
  student: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  attachments: [{
    type: String
  }],
  submittedAt: {
    type: Date,
    default: Date.now
  },
  grade: Number,
  feedback: String
}, { _id: true });

const assignmentSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  points: {
    type: Number,
    required: true
  },
  submissions: [submissionSchema]
}, {
  timestamps: true
});

export const Assignment = mongoose.model<IAssignment>('Assignment', assignmentSchema); 