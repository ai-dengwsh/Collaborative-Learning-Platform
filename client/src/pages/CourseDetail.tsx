import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Tabs,
  Tab,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { useCourse } from '../hooks/useCourse';
import { useAuth } from '../hooks/useAuth';
import { getCourse, deleteCourse } from '../services/course';
import { getCourseAssignments } from '../services/assignment';
import { getCourseDiscussions } from '../services/discussion';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorAlert } from '../components/common/ErrorAlert';
import { ConfirmDialog } from '../components/common/ConfirmDialog';

const CourseDetail: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const [course, setCourse] = useState<Course | null>(null);
  const [assignments, setAssignments] = useState<IAssignment[]>([]);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState<() => Promise<void>>(() => Promise.resolve());
  const [confirmTitle, setConfirmTitle] = useState('');
  const [confirmContent, setConfirmContent] = useState('');

  useEffect(() => {
    if (!courseId) {
      navigate('/courses');
      return;
    }
    fetchCourseData();
  }, [courseId]);

  const fetchCourseData = async () => {
    if (!courseId) return;

    try {
      setLoading(true);
      const [courseRes, assignmentsRes, discussionsRes] = await Promise.all([
        getCourse(courseId),
        getCourseAssignments(courseId),
        getCourseDiscussions(courseId)
      ]);

      if (courseRes.status === 'success' && courseRes.data) {
        setCourse(courseRes.data.course);
      }

      if (assignmentsRes.status === 'success' && assignmentsRes.data) {
        setAssignments(assignmentsRes.data.assignments);
      }

      if (discussionsRes.status === 'success' && discussionsRes.data) {
        setDiscussions(discussionsRes.data.discussions);
      }
    } catch (err: any) {
      setError(err.message || '获取课程信息失败');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinCourse = async () => {
    if (!courseId) return;

    try {
      const response = await joinCourse(courseId);
      if (response.status === 'success') {
        await fetchCourseData();
      }
    } catch (err: any) {
      setError(err.message || '加入课程失败');
    }
  };

  const handleLeaveCourse = async () => {
    if (!courseId) return;

    try {
      const response = await leaveCourse(courseId);
      if (response.status === 'success') {
        await fetchCourseData();
      }
    } catch (err: any) {
      setError(err.message || '退出课程失败');
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const isInstructor = course?.instructor.id === user?.id;
  const isStudent = course?.students.some(student => student.id === user?.id);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} />;
  if (!course) return <Typography>未找到课程</Typography>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Typography variant="h4" gutterBottom>
              {course.title}
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
              {course.description}
            </Typography>
            <Box display="flex" gap={1} mb={2}>
              <Chip label={course.category} color="primary" />
              {course.tags.map((tag, index) => (
                <Chip key={index} label={tag} variant="outlined" />
              ))}
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box display="flex" flexDirection="column" gap={2}>
              {!isInstructor && !isStudent && (
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleJoinCourse}
                >
                  加入课程
                </Button>
              )}
              {!isInstructor && isStudent && (
                <Button
                  variant="outlined"
                  color="error"
                  fullWidth
                  onClick={() => {
                    setConfirmTitle('退出课程');
                    setConfirmContent('确定要退出该课程吗？');
                    setConfirmAction(() => handleLeaveCourse);
                    setOpenConfirm(true);
                  }}
                >
                  退出课程
                </Button>
              )}
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                startIcon={<Chat />}
                onClick={() => navigate(`/courses/${courseId}/chat`)}
              >
                进入聊天室
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} centered>
          <Tab icon={<Description />} label="课程资料" />
          <Tab icon={<Assignment />} label="作业" />
          <Tab icon={<Forum />} label="讨论" />
          <Tab icon={<People />} label="成员" />
        </Tabs>
        <Divider />

        <Box p={3}>
          {activeTab === 0 && (
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">课程资料</Typography>
                {isInstructor && (
                  <Button startIcon={<Add />} variant="contained">
                    上传资料
                  </Button>
                )}
              </Box>
              <List>
                {course.materials.map((material, index) => (
                  <ListItem
                    key={index}
                    secondaryAction={
                      isInstructor && (
                        <IconButton edge="end" aria-label="delete">
                          <Delete />
                        </IconButton>
                      )
                    }
                  >
                    <ListItemIcon>
                      <Description />
                    </ListItemIcon>
                    <ListItemText
                      primary={material.title}
                      secondary={new Date(material.uploadedAt).toLocaleDateString()}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {activeTab === 1 && (
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">作业</Typography>
                {isInstructor && (
                  <Button
                    startIcon={<Add />}
                    variant="contained"
                    onClick={() => navigate(`/courses/${courseId}/assignments/new`)}
                  >
                    发布作业
                  </Button>
                )}
              </Box>
              <List>
                {assignments.map((assignment) => (
                  <ListItemButton
                    key={assignment.id}
                    button
                    onClick={() => navigate(`/courses/${courseId}/assignments/${assignment.id}`)}
                  >
                    <ListItemIcon>
                      <Assignment />
                    </ListItemIcon>
                    <ListItemText
                      primary={assignment.title}
                      secondary={`截止日期：${new Date(assignment.dueDate).toLocaleDateString()}`}
                    />
                  </ListItemButton>
                ))}
              </List>
            </Box>
          )}

          {activeTab === 2 && (
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">讨论</Typography>
                <Button
                  startIcon={<Add />}
                  variant="contained"
                  onClick={() => navigate(`/courses/${courseId}/discussions/new`)}
                >
                  发起讨论
                </Button>
              </Box>
              <List>
                {discussions.map((discussion) => (
                  <ListItemButton
                    key={discussion.id}
                    button
                    onClick={() => navigate(`/courses/${courseId}/discussions/${discussion.id}`)}
                  >
                    <ListItemIcon>
                      <Forum />
                    </ListItemIcon>
                    <ListItemText
                      primary={discussion.title}
                      secondary={`${discussion.author.username} · ${new Date(discussion.createdAt).toLocaleDateString()}`}
                    />
                  </ListItemButton>
                ))}
              </List>
            </Box>
          )}

          {activeTab === 3 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                教师
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary={course.instructor.username}
                    secondary={course.instructor.email}
                  />
                </ListItem>
              </List>

              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                学生 ({course.students.length})
              </Typography>
              <List>
                {course.students.map((student) => (
                  <ListItem key={student.id}>
                    <ListItemText
                      primary={student.username}
                      secondary={student.email}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </Box>
      </Paper>

      <ConfirmDialog
        open={openConfirm}
        title={confirmTitle}
        content={confirmContent}
        onConfirm={async () => {
          await confirmAction();
          setOpenConfirm(false);
        }}
        onCancel={() => setOpenConfirm(false)}
      />
    </Container>
  );
};

export default CourseDetail; 