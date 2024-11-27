import { Request, Response } from 'express';
import { Assignment } from '../models/Assignment';
import { Course } from '../models/Course';
import { AppError } from '../middlewares/errorHandler';
import { catchAsync } from '../middlewares/errorHandler';

// 创建作业
export const createAssignment = catchAsync(async (req: Request, res: Response) => {
  const { title, description, courseId, dueDate, points } = req.body;

  // 检查课程是否存在
  const course = await Course.findById(courseId);
  if (!course) {
    throw new AppError('未找到该课程', 404);
  }

  // 检查是否为课程教师
  if (course.instructor.toString() !== req.user._id.toString()) {
    throw new AppError('只有课程教师可以创建作业', 403);
  }

  const assignment = await Assignment.create({
    title,
    description,
    course: courseId,
    dueDate,
    points
  });

  res.status(201).json({
    status: 'success',
    data: {
      assignment
    }
  });
});

// 获取课程的所有作业
export const getCourseAssignments = catchAsync(async (req: Request, res: Response) => {
  const { courseId } = req.params;

  const assignments = await Assignment.find({ course: courseId })
    .sort('-createdAt');

  res.status(200).json({
    status: 'success',
    results: assignments.length,
    data: {
      assignments
    }
  });
});

// 获取单个作业
export const getAssignment = catchAsync(async (req: Request, res: Response) => {
  const assignment = await Assignment.findById(req.params.id)
    .populate('course', 'title')
    .populate('submissions.student', 'username email');

  if (!assignment) {
    throw new AppError('未找到该作业', 404);
  }

  res.status(200).json({
    status: 'success',
    data: {
      assignment
    }
  });
});

// 提交作业
export const submitAssignment = catchAsync(async (req: Request, res: Response) => {
  const { content, attachments } = req.body;
  const assignment = await Assignment.findById(req.params.id);

  if (!assignment) {
    throw new AppError('未找到该作业', 404);
  }

  // 检查截止日期
  if (new Date() > new Date(assignment.dueDate)) {
    throw new AppError('作业已过截止日期', 400);
  }

  // 检查是否已提交
  const existingSubmission = assignment.submissions.find(
    sub => sub.student.toString() === req.user._id.toString()
  );

  if (existingSubmission) {
    // 更新提交
    existingSubmission.content = content;
    existingSubmission.attachments = attachments;
    existingSubmission.submittedAt = new Date();
  } else {
    // 新提交
    assignment.submissions.push({
      student: req.user._id,
      content,
      attachments,
      submittedAt: new Date()
    });
  }

  await assignment.save();

  res.status(200).json({
    status: 'success',
    message: '作业提交成功'
  });
});

// 评分作业
export const gradeAssignment = catchAsync(async (req: Request, res: Response) => {
  const { grade, feedback } = req.body;
  const { id, submissionId } = req.params;

  const assignment = await Assignment.findById(id);

  if (!assignment) {
    throw new AppError('未找到该作业', 404);
  }

  // 检查是否为课程教师
  const course = await Course.findById(assignment.course);
  if (!course) {
    throw new AppError('未找到相关课程', 404);
  }

  if (course.instructor.toString() !== req.user._id.toString()) {
    throw new AppError('只有课程教师可以评分', 403);
  }

  // 查找并更新提交
  const submission = assignment.submissions.find(sub => sub._id && sub._id.toString() === submissionId);
  if (!submission) {
    throw new AppError('未找到该提交', 404);
  }

  submission.grade = grade;
  submission.feedback = feedback;

  await assignment.save();

  res.status(200).json({
    status: 'success',
    message: '评分成功'
  });
});

// 获取学生的所有作业
export const getStudentAssignments = catchAsync(async (req: Request, res: Response) => {
  const assignments = await Assignment.find({
    'submissions.student': req.user._id
  }).populate('course', 'title');

  res.status(200).json({
    status: 'success',
    results: assignments.length,
    data: {
      assignments
    }
  });
}); 