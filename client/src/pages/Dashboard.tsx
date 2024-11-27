import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions
} from '@mui/material';
import {
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  Forum as ForumIcon
} from '@mui/icons-material';
import { useCourse } from '../hooks/useCourse';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { courses } = useCourse();

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* 统计卡片 */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              height: 140
            }}
          >
            <SchoolIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h6">我的课程</Typography>
            <Typography variant="h4">{courses.length}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              height: 140
            }}
          >
            <AssignmentIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h6">待完成作业</Typography>
            <Typography variant="h4">5</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              height: 140
            }}
          >
            <ForumIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h6">未读讨论</Typography>
            <Typography variant="h4">3</Typography>
          </Paper>
        </Grid>

        {/* 最近的课程 */}
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            最近的课程
          </Typography>
          <Grid container spacing={3}>
            {courses.slice(0, 3).map((course) => (
              <Grid item xs={12} sm={6} md={4} key={course.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {course.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {course.description}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      onClick={() => navigate(`/courses/${course.id}`)}
                    >
                      查看详情
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* 快捷操作 */}
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            快捷操作
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<SchoolIcon />}
                onClick={() => navigate('/courses')}
              >
                浏览所有课程
              </Button>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<AssignmentIcon />}
                onClick={() => navigate('/assignments')}
              >
                查看作业
              </Button>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<ForumIcon />}
                onClick={() => navigate('/discussions')}
              >
                参与讨论
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export { Dashboard }; 