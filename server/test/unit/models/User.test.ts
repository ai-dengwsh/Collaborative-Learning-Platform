import mongoose from 'mongoose';
import { User } from '../../../src/models/User';

describe('User Model Test', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/test');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  it('should create & save user successfully', async () => {
    const validUser = new User({
      username: 'testuser',
      email: 'test@test.com',
      password: 'password123',
      role: 'student'
    });
    const savedUser = await validUser.save();
    expect(savedUser._id).toBeDefined();
    expect(savedUser.email).toBe(validUser.email);
  });

  it('should fail to save user without required fields', async () => {
    const userWithoutRequiredField = new User({ username: 'test' });
    let err;
    try {
      await userWithoutRequiredField.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
  });

  it('should fail to save user with invalid email', async () => {
    const userWithInvalidEmail = new User({
      username: 'testuser',
      email: 'invalid-email',
      password: 'password123',
      role: 'student'
    });
    let err;
    try {
      await userWithInvalidEmail.save();
    } catch (error: any) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.errors.email).toBeDefined();
    expect(err.errors.email.message).toBe('invalid-email is not a valid email address!');
  });

  it('should correctly compare password', async () => {
    const password = 'testPassword123';
    const user = new User({
      username: 'testuser',
      email: 'test@test.com',
      password: password,
      role: 'student'
    });
    await user.save();
    const isMatch = await user.comparePassword(password);
    expect(isMatch).toBe(true);
  });

  it('should not save duplicate email', async () => {
    const user1 = new User({
      username: 'testuser1',
      email: 'test@test.com',
      password: 'password123',
      role: 'student'
    });
    await user1.save();

    const user2 = new User({
      username: 'testuser2',
      email: 'test@test.com',
      password: 'password123',
      role: 'student'
    });

    let err;
    try {
      await user2.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
  });
}); 