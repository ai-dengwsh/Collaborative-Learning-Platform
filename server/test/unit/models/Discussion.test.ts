import mongoose from 'mongoose';
import { Discussion } from '../../../src/models/Discussion';
import { Course } from '../../../src/models/Course';
import { User } from '../../../src/models/User';

describe('Discussion Model Test', () => {
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

  const validDiscussionData = {
    title: 'Test Discussion',
    content: 'This is a test discussion',
    course: null, // 将在beforeEach中设置
    author: null, // 将在beforeEach中设置
    tags: ['question', 'help']
  };

  beforeEach(() => {
    validDiscussionData.course = course._id;
    validDiscussionData.author = student._id;
  });

  it('should create & save discussion successfully', async () => {
    const validDiscussion = new Discussion(validDiscussionData);
    const savedDiscussion = await validDiscussion.save();
    
    expect(savedDiscussion._id).toBeDefined();
    expect(savedDiscussion.title).toBe(validDiscussionData.title);
    expect(savedDiscussion.content).toBe(validDiscussionData.content);
    expect(savedDiscussion.course.toString()).toBe(course._id.toString());
    expect(savedDiscussion.author.toString()).toBe(student._id.toString());
    expect(savedDiscussion.tags).toEqual(expect.arrayContaining(validDiscussionData.tags));
  });

  it('should fail to save discussion without required fields', async () => {
    const discussionWithoutTitle = new Discussion({
      content: 'Test content',
      course: course._id,
      author: student._id
    });

    let err;
    try {
      await discussionWithoutTitle.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  });

  it('should successfully add reply', async () => {
    const discussion = new Discussion(validDiscussionData);
    await discussion.save();

    const reply = {
      content: 'This is a reply',
      author: instructor._id,
      createdAt: new Date(),
      updatedAt: new Date(),
      likes: []
    };

    discussion.replies.push(reply);
    await discussion.save();

    expect(discussion.replies[0].content).toBe(reply.content);
    expect(discussion.replies[0].author.toString()).toBe(instructor._id.toString());
  });

  it('should successfully update reply', async () => {
    const discussion = new Discussion(validDiscussionData);
    await discussion.save();

    const reply = {
      content: 'This is a reply',
      author: instructor._id,
      createdAt: new Date(),
      updatedAt: new Date(),
      likes: []
    };

    discussion.replies.push(reply);
    await discussion.save();

    // 更新回复
    discussion.replies[0].content = 'Updated reply content';
    await discussion.save();

    expect(discussion.replies[0].content).toBe('Updated reply content');
  });

  it('should successfully add and remove likes', async () => {
    const discussion = new Discussion(validDiscussionData);
    await discussion.save();

    // 添加点赞
    discussion.likes.push(instructor._id);
    await discussion.save();
    expect(discussion.likes).toContainEqual(instructor._id);

    // 移除点赞
    discussion.likes = discussion.likes.filter(id => id.toString() !== instructor._id.toString());
    await discussion.save();
    expect(discussion.likes).not.toContainEqual(instructor._id);
  });

  it('should fail to save discussion with empty content', async () => {
    const discussionWithEmptyContent = new Discussion({
      ...validDiscussionData,
      content: ''
    });

    let err;
    try {
      await discussionWithEmptyContent.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  });
}); 