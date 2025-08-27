import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  QuestionAnswer as QuestionsIcon,
  BarChart as StatsIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; 

const AdminDashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newQuiz, setNewQuiz] = useState({ title: '', description: '' });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalQuizzes: 0,
    hasNext: false,
    hasPrev: false
  });

  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, logout } = useAuth(); // Get auth info from context

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isAuthenticated || !isAdmin()) {
      navigate('/login');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  // Fetch quizzes from API
  const fetchQuizzes = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/admin/quizzes?page=${page}`, {
        withCredentials: true // Use cookies instead of token in header
      });
      
      setQuizzes(response.data.data.quizzes);
      setPagination(response.data.data.pagination);
      setError('');
    } catch (err) {
      if (err.response?.status === 401) {
        // Unauthorized - redirect to login
        logout();
        navigate('/login');
      } else {
        setError(err.response?.data?.error || 'Failed to fetch quizzes');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && isAdmin()) {
      fetchQuizzes();
    }
  }, [isAuthenticated, isAdmin]);

  // Create new quiz
  const handleCreateQuiz = async () => {
    try {
      const response = await axios.post(
        `/api/admin/quiz`,
        newQuiz,
        { withCredentials: true } // Use cookies instead of token in header
      );
      
      setSuccess('Quiz created successfully!');
      setCreateDialogOpen(false);
      setNewQuiz({ title: '', description: '' });
      fetchQuizzes(); // Refresh the list
    } catch (err) {
      if (err.response?.status === 401) {
        // Unauthorized - redirect to login
        logout();
        navigate('/login');
      } else {
        setError(err.response?.data?.error || 'Failed to create quiz');
      }
    }
  };

  // Delete quiz
  const handleDeleteQuiz = async (quizId) => {
    if (!window.confirm('Are you sure you want to delete this quiz?')) return;
    
    try {
      await axios.delete(`/api/admin/quiz/${quizId}`, {
        withCredentials: true // Use cookies instead of token in header
      });
      
      setSuccess('Quiz deleted successfully!');
      fetchQuizzes(); // Refresh the list
    } catch (err) {
      if (err.response?.status === 401) {
        // Unauthorized - redirect to login
        logout();
        navigate('/login');
      } else {
        setError(err.response?.data?.error || 'Failed to delete quiz');
      }
    }
  };

  // Toggle quiz status
  const handleToggleStatus = async (quizId, currentStatus) => {
    try {
      await axios.patch(
        `/api/admin/quiz/${quizId}/status`,
        { isActive: !currentStatus },
        { withCredentials: true } // Use cookies instead of token in header
      );
      
      setSuccess(`Quiz ${!currentStatus ? 'activated' : 'deactivated'} successfully!`);
      fetchQuizzes(); // Refresh the list
    } catch (err) {
      if (err.response?.status === 401) {
        // Unauthorized - redirect to login
        logout();
        navigate('/login');
      } else {
        setError(err.response?.data?.error || 'Failed to update quiz status');
      }
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Quiz Management
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2">
            Welcome, {user?.name}
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
          >
            Create New Quiz
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        {quizzes.length === 0 ? (
          <Grid item xs={12}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6">No quizzes found</Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                Create your first quiz to get started
              </Typography>
            </Paper>
          </Grid>
        ) : (
          quizzes.map((quiz) => (
            <Grid item xs={12} md={6} lg={4} key={quiz._id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" component="h2">
                      {quiz.title}
                    </Typography>
                    <Chip
                      label={quiz.isActive ? 'Active' : 'Inactive'}
                      color={quiz.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </Box>
                  
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    {quiz.description}
                  </Typography>
                  
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Questions: {quiz.questions?.length || 0}
                  </Typography>
                  
                  <Typography variant="caption" color="textSecondary">
                    Created: {new Date(quiz.createdAt).toLocaleDateString()}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <IconButton
                      size="small"
                      onClick={() => navigate(`/admin/quiz/${quiz._id}`)}
                    >
                      <ViewIcon />
                    </IconButton>
                    
                    <IconButton
                      size="small"
                      onClick={() => navigate(`/admin/quiz/${quiz._id}/questions`)}
                    >
                      <QuestionsIcon />
                    </IconButton>
                    
                    <IconButton
                      size="small"
                      onClick={() => navigate(`/admin/quiz/${quiz._id}/stats`)}
                    >
                      <StatsIcon />
                    </IconButton>
                    
                    <IconButton
                      size="small"
                      onClick={() => handleToggleStatus(quiz._id, quiz.isActive)}
                    >
                      <EditIcon />
                    </IconButton>
                    
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteQuiz(quiz._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            disabled={!pagination.hasPrev}
            onClick={() => fetchQuizzes(pagination.currentPage - 1)}
          >
            Previous
          </Button>
          
          <Typography sx={{ mx: 2, alignSelf: 'center' }}>
            Page {pagination.currentPage} of {pagination.totalPages}
          </Typography>
          
          <Button
            disabled={!pagination.hasNext}
            onClick={() => fetchQuizzes(pagination.currentPage + 1)}
          >
            Next
          </Button>
        </Box>
      )}

      {/* Create Quiz Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Quiz</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Quiz Title"
            fullWidth
            variant="outlined"
            value={newQuiz.title}
            onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={newQuiz.description}
            onChange={(e) => setNewQuiz({ ...newQuiz, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateQuiz} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
 
export default AdminDashboard;