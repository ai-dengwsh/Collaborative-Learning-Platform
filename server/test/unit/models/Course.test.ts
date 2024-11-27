import mongoose from 'mongoose';
import { Course } from '../../../src/models/Course';
import { User, IUser } from '../../../src/models/User';

describe('Course Model Test', () => {
  let instructor: IUser;

  beforeAll(async () => {
    instructor = await User.create({
      username: 'testinstructor',
      email: 'instructor@test.com',
      password: 'password123',
      role: 'teacher'
    });
  });

  const validCourseData = {
    title: 'Test Course',
    description: 'This is a test course',
    instructor: null as unknown as mongoose.Types.ObjectId,
    category: 'Programming',
    tags: ['JavaScript', 'React'],
    cover: 'https://example.com/cover.jpg',
    isPublished: false
  };

  beforeEach(() => {
    validCourseData.instructor = instructor._id;
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Course.deleteMany({});
  });

  it('should create & save course successfully', async () => {
    const validCourse = new Course(validCourseData);
    const savedCourse = await validCourse.save();
    
    expect(savedCourse._id).toBeDefined();
    expect(savedCourse.title).toBe(validCourseData.title);
    expect(savedCourse.description).toBe(validCourseData.description);
    expect(savedCourse.instructor.toString()).toBe(instructor._id.toString());
    expect(savedCourse.category).toBe(validCourseData.category);
    expect(savedCourse.tags).toEqual(expect.arrayContaining(validCourseData.tags));
  });

  it('should fail to save course without required fields', async () => {
    const courseWithoutTitle = new Course({
      description: 'Test description',
      instructor: instructor._id,
      category: 'Programming'
    });

    let err;
    try {
      await courseWithoutTitle.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  });

  it('should successfully add and remove students', async () => {
    const course = new Course(validCourseData);
    await course.save();

    const student = await User.create({
      username: 'teststudent',
      email: 'student@test.com',
      password: 'password123',
      role: 'student'
    });

    // 添加学生
    course.students.push(student._id);
    await course.save();
    expect(course.students).toContainEqual(student._id);

    // 移除学生
    course.students = course.students.filter(id => id.toString() !== student._id.toString());
    await course.save();
    expect(course.students).not.toContainEqual(student._id);

    await User.deleteOne({ _id: student._id });
  });

  it('should successfully add course materials', async () => {
    const course = new Course(validCourseData);
    await course.save();

    const material = {
      title: 'Test Material',
      type: 'pdf',
      url: 'https://example.com/material.pdf',
      uploadedAt: new Date()
    };

    course.materials.push(material);
    await course.save();

    expect(course.materials[0].title).toBe(material.title);
    expect(course.materials[0].type).toBe(material.type);
    expect(course.materials[0].url).toBe(material.url);
  });

  it('should successfully add course announcements', async () => {
    const course = new Course(validCourseData);
    await course.save();

    const announcement = {
      title: 'Test Announcement',
      content: 'This is a test announcement',
      createdAt: new Date()
    };

    course.announcements.push(announcement);
    await course.save();

    expect(course.announcements[0].title).toBe(announcement.title);
    expect(course.announcements[0].content).toBe(announcement.content);
  });

  it('should fail to save course with invalid category', async () => {
    const courseWithInvalidCategory = new Course({
      ...validCourseData,
      category: ''
    });

    let err;
    try {
      await courseWithInvalidCategory.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  });
}); 