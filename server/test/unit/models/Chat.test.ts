import mongoose from 'mongoose';
import { Chat } from '../../../src/models/Chat';
import { User, IUser } from '../../../src/models/User';
import { Course, ICourse } from '../../../src/models/Course';

describe('Chat Model Test', () => {
  let user1: IUser;
  let user2: IUser;
  let course: ICourse;

  beforeAll(async () => {
    user1 = await User.create({
      username: 'testuser1',
      email: 'test1@test.com',
      password: 'password123',
      role: 'teacher'
    });

    user2 = await User.create({
      username: 'testuser2',
      email: 'test2@test.com',
      password: 'password123',
      role: 'student'
    });

    course = await Course.create({
      title: 'Test Course',
      description: 'Test Description',
      instructor: user1._id,
      category: 'Programming',
      tags: ['test']
    });
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Course.deleteMany({});
    await Chat.deleteMany({});
  });

  it('should create a chat room successfully', async () => {
    const chat = new Chat({
      title: 'Test Chat',
      course: course._id,
      participants: [user1._id, user2._id]
    });

    const savedChat = await chat.save();
    expect(savedChat._id).toBeDefined();
    expect(savedChat.participants).toHaveLength(2);
    expect(savedChat.title).toBe('Test Chat');
  });

  it('should add text message successfully', async () => {
    const chat = new Chat({
      title: 'Test Chat',
      course: course._id,
      participants: [user1._id, user2._id]
    });

    chat.messages.push({
      content: 'Hello, World!',
      sender: user1._id,
      createdAt: new Date()
    });

    await chat.save();

    expect(chat.messages).toHaveLength(1);
    expect(chat.messages[0].sender.toString()).toBe(user1._id.toString());
    expect(chat.messages[0].content).toBe('Hello, World!');
  });

  it('should add message with attachments successfully', async () => {
    const chat = new Chat({
      title: 'Test Chat',
      course: course._id,
      participants: [user1._id, user2._id]
    });

    chat.messages.push({
      content: 'Check this file',
      sender: user1._id,
      attachments: [{
        url: 'https://example.com/test.pdf',
        public_id: 'test123',
        name: 'test.pdf'
      }],
      createdAt: new Date()
    });

    await chat.save();

    expect(chat.messages[0].attachments).toHaveLength(1);
    expect(chat.messages[0].attachments![0].name).toBe('test.pdf');
  });

  it('should require title field', async () => {
    const chat = new Chat({
      course: course._id,
      participants: [user1._id, user2._id]
    });

    await expect(chat.save()).rejects.toThrow();
  });

  it('should require course field', async () => {
    const chat = new Chat({
      title: 'Test Chat',
      participants: [user1._id, user2._id]
    });

    await expect(chat.save()).rejects.toThrow();
  });
}); 