import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '../store';
import {
  login,
  register,
  logout,
  getCurrentUser,
  updateProfile,
  clearError,
} from '../store/slices/authSlice';
import { User } from '../types';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, token, loading, error } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (token && !user) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, token, user]);

  const handleLogin = async (email: string, password: string) => {
    try {
      await dispatch(login({ email, password })).unwrap();
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleRegister = async (
    username: string,
    email: string,
    password: string,
    role?: 'student' | 'teacher'
  ) => {
    try {
      await dispatch(register({ username, email, password, role })).unwrap();
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleUpdateProfile = async (data: Partial<User>) => {
    try {
      await dispatch(updateProfile(data)).unwrap();
    } catch (error) {
      console.error('Profile update failed:', error);
    }
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  return {
    user,
    token,
    loading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    updateProfile: handleUpdateProfile,
    clearError: handleClearError,
  };
}; 