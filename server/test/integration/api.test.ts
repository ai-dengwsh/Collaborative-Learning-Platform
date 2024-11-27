import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../src/app';
import { User } from '../../src/models/User';
import { Course } from '../../src/models/Course';
import { Assignment } from '../../src/models/Assignment';
import { Discussion } from '../../src/models/Discussion';
import { Chat } from '../../src/models/Chat';

describe('API Integration Tests', () => {
  let authToken: string;
  let testUser: any;
  let testCourse: any;
  let testAssignment: any;
  let testDiscussion: any;
  let testChat: any;

  beforeAll(async () => {
    // 连接测试数据库
    await mongoose.connect(process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/test');
  });

  afterAll(async () => {
    // 清理数据库并断开连接
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // 清理所有集合
    await User.deleteMany({});
    await Course.deleteMany({});
    await Assignment.deleteMany({});
    await Discussion.deleteMany({});
    await Chat.deleteMany({});

    // 创建测试用户
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        role: 'teacher'
      });

    authToken = response.body.token;
    testUser = response.body.user;
  });

  describe('Authentication API', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'newuser',
          email: 'new@example.com',
          password: 'password123',
          role: 'student'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('username', 'newuser');
    });

    it('should login existing user', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });
  });

  describe('Course API', () => {
    beforeEach(async () => {
      // 创建测试课程
      const response = await request(app)
        .post('/api/courses')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Course',
          description: 'Test Description',
          category: 'Programming'
        });

      testCourse = response.body;
    });

    it('should create a new course', async () => {
      const response = await request(app)
        .post('/api/courses')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Another Course',
          description: 'Another Description',
          category: 'Math'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('title', 'Another Course');
    });

    it('should get course details', async () => {
      const response = await request(app)
        .get(`/api/courses/${testCourse._id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('_id', testCourse._id);
    });
  });

  describe('Assignment API', () => {
    beforeEach(async () => {
      // 创建测试作业
      const response = await request(app)
        .post(`/api/courses/${testCourse._id}/assignments`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Assignment',
          description: 'Test Description',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          points: 100
        });

      testAssignment = response.body;
    });

    it('should create a new assignment', async () => {
      const response = await request(app)
        .post(`/api/courses/${testCourse._id}/assignments`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Another Assignment',
          description: 'Another Description',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          points: 50
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('title', 'Another Assignment');
    });

    it('should submit assignment', async () => {
      const response = await request(app)
        .post(`/api/assignments/${testAssignment._id}/submit`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'Test Submission',
          attachments: ['https://example.com/file.pdf']
        });

      expect(response.status).toBe(200);
      expect(response.body.submissions).toHaveLength(1);
    });
  });

  describe('Discussion API', () => {
    beforeEach(async () => {
      // 创建测试讨论
      const response = await request(app)
        .post(`/api/courses/${testCourse._id}/discussions`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Discussion',
          content: 'Test Content',
          tags: ['question']
        });

      testDiscussion = response.body;
    });

    it('should create a new discussion', async () => {
      const response = await request(app)
        .post(`/api/courses/${testCourse._id}/discussions`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Another Discussion',
          content: 'Another Content',
          tags: ['help']
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('title', 'Another Discussion');
    });

    it('should add reply to discussion', async () => {
      const response = await request(app)
        .post(`/api/discussions/${testDiscussion._id}/replies`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'Test Reply'
        });

      expect(response.status).toBe(200);
      expect(response.body.replies).toHaveLength(1);
    });
  });

  describe('Chat API', () => {
    let otherUser: any;

    beforeEach(async () => {
      // 创建另一个用户
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'otheruser',
          email: 'other@example.com',
          password: 'password123',
          role: 'student'
        });

      otherUser = response.body.user;

      // 创建测试聊天
      const chatResponse = await request(app)
        .post('/api/chats')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          participants: [otherUser._id],
          type: 'private'
        });

      testChat = chatResponse.body;
    });

    it('should create a new chat', async () => {
      const response = await request(app)
        .post('/api/chats')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          participants: [otherUser._id],
          type: 'private'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('type', 'private');
    });

    it('should send message in chat', async () => {
      const response = await request(app)
        .post(`/api/chats/${testChat._id}/messages`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'Test Message',
          type: 'text'
        });

      expect(response.status).toBe(200);
      expect(response.body.messages).toHaveLength(1);
    });
  });

  describe('File Upload API', () => {
    it('should upload file', async () => {
      const response = await request(app)
        .post('/api/upload')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('file', Buffer.from('test content'), {
          filename: 'test.pdf',
          contentType: 'application/pdf'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('url');
    });

    it('should reject invalid file type', async () => {
      const response = await request(app)
        .post('/api/upload')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('file', Buffer.from('test content'), {
          filename: 'test.exe',
          contentType: 'application/x-msdownload'
        });

      expect(response.status).toBe(400);
    });
  });
}); 