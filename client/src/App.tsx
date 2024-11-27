import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import MainLayout from './components/Layout/MainLayout';
import AuthGuard from './components/common/AuthGuard';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CourseList from './pages/CourseList';
import CourseDetail from './pages/CourseDetail';
import AssignmentList from './pages/AssignmentList';
import AssignmentDetail from './pages/AssignmentDetail';
import DiscussionList from './pages/DiscussionList';
import DiscussionDetail from './pages/DiscussionDetail';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

const App: React.FC = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <Router>
      <Routes>
        {/* 公开路由 */}
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />

        {/* 受保护路由 */}
        <Route element={<AuthGuard><MainLayout /></AuthGuard>}>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/courses" element={<CourseList />} />
          <Route path="/courses/:courseId" element={<CourseDetail />} />
          <Route path="/courses/:courseId/assignments" element={<AssignmentList />} />
          <Route path="/courses/:courseId/assignments/:assignmentId" element={<AssignmentDetail />} />
          <Route path="/courses/:courseId/discussions" element={<DiscussionList />} />
          <Route path="/courses/:courseId/discussions/:discussionId" element={<DiscussionDetail />} />
          <Route path="/courses/:courseId/chat" element={<Chat />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* 404页面 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
