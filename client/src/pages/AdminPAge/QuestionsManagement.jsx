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
  List,
  ListItem,
  ListItemText,
  IconButton,
  Chip,
  Divider
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext'; 

const QuestionsManagement = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [newQuestion, setNewQuestion] = useState({
    questionText: '',
    options: ['', ''],
    correctAnswer: ''
  });

  const { isAuthenticated, isAdmin, logout } = useAuth(); // Get auth info from context

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isAuthenticated || !isAdmin()) {
      navigate('/login');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated || !isAdmin()) return;
      
      try {
        setLoading(true);
        
        // Fetch quiz details
        const quizResponse = await axios.get(`/api/admin/quiz/${quizId}`, {
          withCredentials: true // Use cookies instead of token in header
        });
        setQuiz(quizResponse.data.data.quiz);
        
        // Fetch questions
        const questionsResponse = await axios.get(`/api/admin/quiz/${quizId}/questions`, {
          withCredentials: true // Use cookies instead of token in header
        });
        setQuestions(questionsResponse.data.data.questions);
        
        setError('');
      } catch (err) {
        if (err.response?.status === 401) {
          // Unauthorized - redirect to login
          logout();
          navigate('/login');
        } else {
          setError(err.response?.data?.error || 'Failed to fetch data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [quizId, isAuthenticated, isAdmin, logout, navigate]);

  const handleAddQuestion = async () => {
    try {
      await axios.post(
        `/api/admin/quiz/${quizId}/questions`,
        { questions: [newQuestion] },
        { withCredentials: true } // Use cookies instead of token in header
      );
      
      setSuccess('Question added successfully!');
      setAddDialogOpen(false);
      setNewQuestion({
        questionText: '',
        options: ['', ''],
        correctAnswer: ''
      });
      
      // Refresh questions list
      const response = await axios.get(`/api/admin/quiz/${quizId}/questions`, {
        withCredentials: true // Use cookies instead of token in header
      });
      setQuestions(response.data.data.questions);
    } catch (err) {
      if (err.response?.status === 401) {
        // Unauthorized - redirect to login
        logout();
        navigate('/login');
      } else {
        setError(err.response?.data?.error || 'Failed to add question');
      }
    }
  };

  const handleUpdateQuestion = async () => {
    try {
      await axios.put(
        `/api/admin/question/${currentQuestion._id}`,
        currentQuestion,
        { withCredentials: true } // Use cookies instead of token in header
      );
      
      setSuccess('Question updated successfully!');
      setEditDialogOpen(false);
      setCurrentQuestion(null);
      
      // Refresh questions list
      const response = await axios.get(`/api/admin/quiz/${quizId}/questions`, {
        withCredentials: true // Use cookies instead of token in header
      });
      setQuestions(response.data.data.questions);
    } catch (err) {
      if (err.response?.status === 401) {
        // Unauthorized - redirect to login
        logout();
        navigate('/login');
      } else {
        setError(err.response?.data?.error || 'Failed to update question');
      }
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    
    try {
      await axios.delete(`/api/admin/question/${questionId}`, {
        withCredentials: true // Use cookies instead of token in header
      });
      
      setSuccess('Question deleted successfully!');
      
      // Refresh questions list
      const response = await axios.get(`/api/admin/quiz/${quizId}/questions`, {
        withCredentials: true // Use cookies instead of token in header
      });
      setQuestions(response.data.data.questions);
    } catch (err) {
      if (err.response?.status === 401) {
        // Unauthorized - redirect to login
        logout();
        navigate('/login');
      } else {
        setError(err.response?.data?.error || 'Failed to delete question');
      }
    }
  };

  const addOption = () => {
    setNewQuestion({
      ...newQuestion,
      options: [...newQuestion.options, '']
    });
  };

  const removeOption = (index) => {
    const newOptions = [...newQuestion.options];
    newOptions.splice(index, 1);
    setNewQuestion({
      ...newQuestion,
      options: newOptions
    });
  };

  const updateOption = (index, value) => {
    const newOptions = [...newQuestion.options];
    newOptions[index] = value;
    setNewQuestion({
      ...newQuestion,
      options: newOptions
    });
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
      <Button startIcon={<BackIcon />} onClick={() => navigate(`/admin/quiz/${quizId}`)} sx={{ mb: 2 }}>
        Back to Quiz
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
          Manage Questions: {quiz?.title}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAddDialogOpen(true)}
        >
          Add Question
        </Button>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Questions ({questions.length})
        </Typography>
        
        {questions.length === 0 ? (
          <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', py: 4 }}>
            No questions yet. Add your first question to get started.
          </Typography>
        ) : (
          <List>
            {questions.map((question, index) => (
              <React.Fragment key={question._id}>
                <ListItem
                  secondaryAction={
                    <Box>
                      <IconButton
                        edge="end"
                        aria-label="edit"
                        onClick={() => {
                          setCurrentQuestion({ ...question });
                          setEditDialogOpen(true);
                        }}
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDeleteQuestion(question._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemText
                    primary={`${index + 1}. ${question.questionText}`}
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        {question.options.map((option, optIndex) => (
                          <Chip
                            key={optIndex}
                            label={option}
                            color={option === question.correctAnswer ? 'success' : 'default'}
                            variant={option === question.correctAnswer ? 'filled' : 'outlined'}
                            size="small"
                            sx={{ mr: 0.5, mb: 0.5 }}
                          />
                        ))}
                      </Box>
                    }
                  />
                </ListItem>
                {index < questions.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>

      {/* Add Question Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Question</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Question Text"
            fullWidth
            variant="outlined"
            value={newQuestion.questionText}
            onChange={(e) => setNewQuestion({ ...newQuestion, questionText: e.target.value })}
            sx={{ mb: 2 }}
          />
          
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Options (mark the correct answer by selecting it below)
          </Typography>
          
          {newQuestion.options.map((option, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <TextField
                margin="dense"
                label={`Option ${index + 1}`}
                fullWidth
                variant="outlined"
                value={option}
                onChange={(e) => updateOption(index, e.target.value)}
                sx={{ mr: 1 }}
              />
              {newQuestion.options.length > 2 && (
                <Button
                  color="error"
                  onClick={() => removeOption(index)}
                >
                  Remove
                </Button>
              )}
            </Box>
          ))}
          
          <Button onClick={addOption} sx={{ mt: 1 }}>
            Add Option
          </Button>
          
          <TextField
            select
            margin="dense"
            label="Correct Answer"
            fullWidth
            variant="outlined"
            value={newQuestion.correctAnswer}
            onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })}
            sx={{ mt: 2 }}
            SelectProps={{
              native: true,
            }}
          >
            <option value="">Select correct answer</option>
            {newQuestion.options.map((option, index) => (
              option && <option key={index} value={option}>{option}</option>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleAddQuestion} 
            variant="contained"
            disabled={!newQuestion.questionText || !newQuestion.correctAnswer || newQuestion.options.filter(opt => opt).length < 2}
          >
            Add Question
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Question Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Question</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Question Text"
            fullWidth
            variant="outlined"
            value={currentQuestion?.questionText || ''}
            onChange={(e) => setCurrentQuestion({ ...currentQuestion, questionText: e.target.value })}
            sx={{ mb: 2 }}
          />
          
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Options (mark the correct answer by selecting it below)
          </Typography>
          
          {currentQuestion?.options.map((option, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <TextField
                margin="dense"
                label={`Option ${index + 1}`}
                fullWidth
                variant="outlined"
                value={option}
                onChange={(e) => {
                  const newOptions = [...currentQuestion.options];
                  newOptions[index] = e.target.value;
                  setCurrentQuestion({ ...currentQuestion, options: newOptions });
                }}
                sx={{ mr: 1 }}
              />
            </Box>
          ))}
          
          <TextField
            select
            margin="dense"
            label="Correct Answer"
            fullWidth
            variant="outlined"
            value={currentQuestion?.correctAnswer || ''}
            onChange={(e) => setCurrentQuestion({ ...currentQuestion, correctAnswer: e.target.value })}
            sx={{ mt: 2 }}
            SelectProps={{
              native: true,
            }}
          >
            <option value="">Select correct answer</option>
            {currentQuestion?.options.map((option, index) => (
              option && <option key={index} value={option}>{option}</option>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleUpdateQuestion} 
            variant="contained"
            disabled={!currentQuestion?.questionText || !currentQuestion?.correctAnswer || currentQuestion.options.filter(opt => opt).length < 2}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default QuestionsManagement;