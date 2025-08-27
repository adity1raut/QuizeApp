import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress,
  Chip,
  IconButton
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext'; 

const QuizDetail = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editData, setEditData] = useState({ title: '', description: '' });

  const { isAuthenticated, isAdmin, logout } = useAuth(); // Get auth info from context

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isAuthenticated || !isAdmin()) {
      navigate('/login');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!isAuthenticated || !isAdmin()) return;
      
      try {
        setLoading(true);
        const response = await axios.get(`/api/admin/quiz/${quizId}`, {
          withCredentials: true // Use cookies instead of token in header
        });
        
        setQuiz(response.data.data.quiz);
        setEditData({
          title: response.data.data.quiz.title,
          description: response.data.data.quiz.description
        });
        setError('');
      } catch (err) {
        if (err.response?.status === 401) {
          // Unauthorized - redirect to login
          logout();
          navigate('/login');
        } else {
          setError(err.response?.data?.error || 'Failed to fetch quiz details');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId, isAuthenticated, isAdmin, logout, navigate]);

  const handleUpdateQuiz = async () => {
    try {
      const response = await axios.put(
        `/api/admin/quiz/${quizId}`,
        editData,
        { withCredentials: true } // Use cookies instead of token in header
      );
      
      setQuiz(response.data.data.quiz);
      setSuccess('Quiz updated successfully!');
      setEditDialogOpen(false);
    } catch (err) {
      if (err.response?.status === 401) {
        // Unauthorized - redirect to login
        logout();
        navigate('/login');
      } else {
        setError(err.response?.data?.error || 'Failed to update quiz');
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

  if (!quiz) {
    return (
      <Container maxWidth="lg">
        <Typography variant="h6" color="error">
          Quiz not found
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Button startIcon={<BackIcon />} onClick={() => navigate('/admin')} sx={{ mb: 2 }}>
        Back to Dashboard
      </Button>

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

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          {quiz.title}
        </Typography>
        <Chip
          label={quiz.isActive ? 'Active' : 'Inactive'}
          color={quiz.isActive ? 'success' : 'default'}
        />
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6">Quiz Details</Typography>
          <IconButton onClick={() => setEditDialogOpen(true)}>
            <EditIcon />
          </IconButton>
        </Box>
        
        <Typography variant="body1" sx={{ mb: 2 }}>
          {quiz.description}
        </Typography>
        
        <Typography variant="body2" color="textSecondary">
          Created: {new Date(quiz.createdAt).toLocaleString()}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Last Updated: {new Date(quiz.updatedAt).toLocaleString()}
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          Questions: {quiz.questions.length}
        </Typography>
      </Paper>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="outlined"
          onClick={() => navigate(`/admin/quiz/${quizId}/questions`)}
        >
          Manage Questions
        </Button>
        <Button
          variant="outlined"
          onClick={() => navigate(`/admin/quiz/${quizId}/stats`)}
        >
          View Statistics
        </Button>
      </Box>

      {/* Edit Quiz Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Quiz</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Quiz Title"
            fullWidth
            variant="outlined"
            value={editData.title}
            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={editData.description}
            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdateQuiz} variant="contained">Save Changes</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}; 

export default QuizDetail;