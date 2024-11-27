import mongoose from 'mongoose';
import { Assignment } from '../../../src/models/Assignment';
import { Course } from '../../../src/models/Course';
import { User } from '../../../src/models/User';

describe('Assignment Model Test', () => {
  let course;
  let instructor;
  let student;

  beforeAll(async () => {
    instructor = await User.create({
      username: 'testinstructor',
      email: 'instructor@test.com',
      password: 'password123',
      role: 'teacher'
    });

    course = await Course.create({
      title: 'Test Course',
      description: 'Test Description',
      instructor: instructor._id,
      category: 'Programming'
    });

    student = await User.create({
      username: 'teststudent',
      email: 'student@test.com',
      password: 'password123',
      role: 'student'
    });
  });

  const validAssignmentData = {
    title: 'Test Assignment',
    description: 'This is a test assignment',
    course: null, // 将在beforeEach中设置
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 一周后
    points: 100
  };

  beforeEach(() => {
    validAssignmentData.course = course._id;
  });

  it('should create & save assignment successfully', async () => {
    const validAssignment = new Assignment(validAssignmentData);
    const savedAssignment = await validAssignment.save();
    
    expect(savedAssignment._id).toBeDefined();
    expect(savedAssignment.title).toBe(validAssignmentData.title);
    expect(savedAssignment.description).toBe(validAssignmentData.description);
    expect(savedAssignment.course.toString()).toBe(course._id.toString());
    expect(savedAssignment.points).toBe(validAssignmentData.points);
  });

  it('should fail to save assignment without required fields', async () => {
    const assignmentWithoutTitle = new Assignment({
      description: 'Test description',
      course: course._id,
      dueDate: new Date(),
      points: 100
    });

    let err;
    try {
      await assignmentWithoutTitle.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  });

  it('should successfully add submission', async () => {
    const assignment = new Assignment(validAssignmentData);
    await assignment.save();

    const submission = {
      student: student._id,
      content: 'This is my submission',
      attachments: ['https://example.com/file.pdf'],
      submittedAt: new Date()
    };

    assignment.submissions.push(submission);
    await assignment.save();

    expect(assignment.submissions[0].student.toString()).toBe(student._id.toString());
    expect(assignment.submissions[0].content).toBe(submission.content);
    expect(assignment.submissions[0].attachments).toEqual(submission.attachments);
  });

  it('should successfully grade submission', async () => {
    const assignment = new Assignment(validAssignmentData);
    await assignment.save();

    const submission = {
      student: student._id,
      content: 'This is my submission',
      attachments: [],
      submittedAt: new Date()
    };

    assignment.submissions.push(submission);
    await assignment.save();

    // 添加评分和反馈
    assignment.submissions[0].grade = 90;
    assignment.submissions[0].feedback = 'Good job!';
    await assignment.save();

    expect(assignment.submissions[0].grade).toBe(90);
    expect(assignment.submissions[0].feedback).toBe('Good job!');
  });

  it('should fail to save assignment with invalid points', async () => {
    const assignmentWithInvalidPoints = new Assignment({
      ...validAssignmentData,
      points: -10
    });

    let err;
    try {
      await assignmentWithInvalidPoints.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  });

  it('should fail to save assignment with past due date', async () => {
    const assignmentWithPastDueDate = new Assignment({
      ...validAssignmentData,
      dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000) // 昨天
    });

    let err;
    try {
      await assignmentWithPastDueDate.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  });
}); 