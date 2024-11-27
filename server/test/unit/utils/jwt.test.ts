import { generateToken, verifyToken, extractToken } from '../../../src/utils/jwt';
import { User } from '../../../src/models/User';

describe('JWT Utils Tests', () => {
  const mockUser = {
    _id: '507f1f77bcf86cd799439011',
    email: 'test@example.com',
    role: 'student'
  };

  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const token = generateToken(mockUser as any);
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
    });

    it('should include user information in token payload', () => {
      const token = generateToken(mockUser as any);
      const decoded = verifyToken(token);
      
      expect(decoded).toHaveProperty('id', mockUser._id);
      expect(decoded).toHaveProperty('email', mockUser.email);
      expect(decoded).toHaveProperty('role', mockUser.role);
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token', () => {
      const token = generateToken(mockUser as any);
      const decoded = verifyToken(token);
      expect(decoded).toBeDefined();
    });

    it('should throw error for invalid token', () => {
      expect(() => {
        verifyToken('invalid-token');
      }).toThrow('Invalid token');
    });
  });

  describe('extractToken', () => {
    it('should extract token from authorization header', () => {
      const token = 'valid-token';
      const authHeader = `Bearer ${token}`;
      const extractedToken = extractToken(authHeader);
      expect(extractedToken).toBe(token);
    });

    it('should throw error if no token provided', () => {
      expect(() => {
        extractToken('');
      }).toThrow('No token provided');
    });

    it('should throw error if token format is invalid', () => {
      expect(() => {
        extractToken('Invalid-Format token');
      }).toThrow('No token provided');
    });
  });
}); 