import { Request, Response, NextFunction } from 'express';
import { User } from '../../../src/models/User';
import { register, login, getCurrentUser, updateUser } from '../../../src/controllers/userController';

describe('User Controller Tests', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let responseObject = {};

  beforeEach(() => {
    mockRequest = {
      user: undefined,
      body: {}
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockImplementation((result) => {
        responseObject = result;
      })
    };
    mockNext = jest.fn();
  });

  describe('Register', () => {
    const registerData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      role: 'student'
    };

    it('should register a new user successfully', async () => {
      mockRequest.body = registerData;

      await register(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(responseObject).toHaveProperty('status', 'success');
      expect(responseObject).toHaveProperty('token');
      expect(responseObject).toHaveProperty('data.user.username', registerData.username);
    });

    it('should fail to register with duplicate email', async () => {
      // 先创建一个用户
      await User.create(registerData);

      mockRequest.body = registerData;
      await register(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      const error = (mockNext as jest.Mock).mock.calls[0][0];
      expect(error.statusCode).toBe(400);
    });
  });

  describe('Login', () => {
    const loginData = {
      email: 'test@example.com',
      password: 'password123'
    };

    beforeEach(async () => {
      await User.create({
        username: 'testuser',
        email: loginData.email,
        password: loginData.password,
        role: 'student'
      });
    });

    it('should login successfully with correct credentials', async () => {
      mockRequest.body = loginData;

      await login(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(responseObject).toHaveProperty('status', 'success');
      expect(responseObject).toHaveProperty('token');
    });

    it('should fail to login with incorrect password', async () => {
      mockRequest.body = {
        email: loginData.email,
        password: 'wrongpassword'
      };

      await login(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      const error = (mockNext as jest.Mock).mock.calls[0][0];
      expect(error.statusCode).toBe(401);
    });
  });

  describe('Get Current User', () => {
    let user;

    beforeEach(async () => {
      user = await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        role: 'student'
      });
      mockRequest = {
        user: user.toObject()
      };
    });

    it('should get current user info successfully', async () => {
      await getCurrentUser(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(responseObject).toHaveProperty('status', 'success');
      expect(responseObject).toHaveProperty('data.user.username', user.username);
    });
  });

  describe('Update User', () => {
    let user;

    beforeEach(async () => {
      user = await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        role: 'student'
      });
      mockRequest = {
        user: user.toObject(),
        body: {}
      };
    });

    it('should update user info successfully', async () => {
      const updateData = {
        username: 'newusername',
        bio: 'New bio'
      };
      mockRequest.body = updateData;

      await updateUser(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(responseObject).toHaveProperty('status', 'success');
      expect(responseObject).toHaveProperty('data.user.username', updateData.username);
      expect(responseObject).toHaveProperty('data.user.bio', updateData.bio);
    });
  });
}); 