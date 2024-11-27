import { Request, Response } from 'express';
import { Course } from '../models/Course';
import { AppError } from '../middlewares/errorHandler';
import { catchAsync } from '../middlewares/errorHandler';

// 创建课程
export const createCourse = catchAsync(async (req: Request, res: Response) => {
  const { title, description, category, tags } = req.body;

  const course = await Course.create({
    title,
    description,
    category,
    tags,
    instructor: req.user._id
  });

  res.status(201).json({
    status: 'success',
    data: {
      course
    }
  });
});

// 获取所有课程
export const getAllCourses = catchAsync(async (req: Request, res: Response) => {
  const query = Course.find();

  // 过滤
  if (req.query.category) {
    query.where('category').equals(req.query.category);
  }
  if (req.query.tags) {
    query.where('tags').in(req.query.tags.toString().split(','));
  }
  if (req.query.instructor) {
    query.where('instructor').equals(req.query.instructor);
  }

  // 排序
  if (req.query.sort) {
    query.sort(req.query.sort.toString());
  } else {
    query.sort('-createdAt');
  }

  // 分页
  const page = parseInt(req.query.page?.toString() || '1');
  const limit = parseInt(req.query.limit?.toString() || '10');
  const skip = (page - 1) * limit;

  query.skip(skip).limit(limit);

  // 执行查询
  const courses = await query.populate('instructor', 'username email');

  res.status(200).json({
    status: 'success',
    results: courses.length,
    data: {
      courses
    }
  });
});

// 获取单个课程
export const getCourse = catchAsync(async (req: Request, res: Response) => {
  const course = await Course.findById(req.params.id)
    .populate('instructor', 'username email')
    .populate('students', 'username email');

  if (!course) {
    throw new AppError('未找到该课程', 404);
  }

  res.status(200).json({
    status: 'success',
    data: {
      course
    }
  });
});

// 更新课程
export const updateCourse = catchAsync(async (req: Request, res: Response) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    throw new AppError('未找到该课程', 404);
  }

  // 检查权限
  if (course.instructor.toString() !== req.user._id.toString()) {
    throw new AppError('您没有权限修改此课程', 403);
  }

  const updatedCourse = await Course.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    data: {
      course: updatedCourse
    }
  });
});

// 删除课程
export const deleteCourse = catchAsync(async (req: Request, res: Response) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    throw new AppError('未找到该课程', 404);
  }

  // 检查权限
  if (course.instructor.toString() !== req.user._id.toString()) {
    throw new AppError('您没有权限删除此课程', 403);
  }

  await course.deleteOne();

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// 学生加入课程
export const joinCourse = catchAsync(async (req: Request, res: Response) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    throw new AppError('未找到该课程', 404);
  }

  // 检查学生是否已经加入
  if (course.students.includes(req.user._id)) {
    throw new AppError('您已经加入了该课程', 400);
  }

  course.students.push(req.user._id);
  await course.save();

  res.status(200).json({
    status: 'success',
    message: '成功加入课程'
  });
});

// 学生退出课程
export const leaveCourse = catchAsync(async (req: Request, res: Response) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    throw new AppError('未找到该课程', 404);
  }

  // 检查学生是否在课程中
  if (!course.students.includes(req.user._id)) {
    throw new AppError('您尚未加入该课程', 400);
  }

  course.students = course.students.filter(
    student => student.toString() !== req.user._id.toString()
  );
  await course.save();

  res.status(200).json({
    status: 'success',
    message: '成功退出课程'
  });
}); 