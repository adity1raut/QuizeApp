import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Card,
  CardContent,
  Grid,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Tab,
  Tabs,
  CircularProgress,
  Alert,
  AppBar,
  Toolbar,
  Button,
  Avatar,
  IconButton,
  ThemeProvider,
  createTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Logout, Dashboard, Leaderboard } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

// Create a dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#0d1117',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e1e1e',
          backgroundImage: 'none',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#252525',
        },
      },
    },
  },
});

// Styled components
const StyledTableRow = styled(TableRow)(({ theme, rank }) => ({
  backgroundColor: rank === 1 
    ? 'rgba(255, 215, 0, 0.15)' 
    : rank === 2 
      ? 'rgba(192, 192, 192, 0.15)' 
      : rank === 3 
        ? 'rgba(205, 127, 50, 0.15)' 
        : 'transparent',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const ScoreChip = styled(Chip)(({ score, theme }) => {
  let color = theme.palette.grey[700];
  
  if (score >= 90) color = '#2e7d32';
  else if (score >= 70) color = '#1565c0';
  else if (score >= 50) color = '#ed6c02';
  else color = '#d32f2f';
  
  return {
    backgroundColor: color,
    color: '#ffffff',
    fontWeight: 'bold'
  };
});

// Tab Panel Component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`leaderboard-tabpanel-${index}`}
      aria-labelledby={`leaderboard-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

// Main Admin Leaderboard Component
const AdminLeaderboard = () => {
  const { user, logout, isAdmin } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [globalLeaderboard, setGlobalLeaderboard] = useState([]);
  const [quizLeaderboard, setQuizLeaderboard] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState('');
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userIdSearch, setUserIdSearch] = useState('');

  // Check if user is admin, redirect if not
  useEffect(() => {
    if (!isAdmin()) {
      window.location.href = '/unauthorized';
    }
  }, [isAdmin]);

  // Fetch global leaderboard
  const fetchGlobalLeaderboard = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/admin/leaderboard/global?limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGlobalLeaderboard(response.data.leaderboard);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch global leaderboard');
    } finally {
      setLoading(false);
    }
  };

  // Fetch quiz leaderboard
  const fetchQuizLeaderboard = async () => {
    if (!selectedQuiz) return;
    
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/admin/leaderboard/quiz/${selectedQuiz}?limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQuizLeaderboard(response.data.leaderboard);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch quiz leaderboard');
    } finally {
      setLoading(false);
    }
  };

  // Fetch available quizzes
  const fetchQuizzes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/admin/quizzes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQuizzes(response.data.quizzes || []);
    } catch (err) {
      console.error('Failed to fetch quizzes', err);
    }
  };

  // Fetch user stats
  const fetchUserStats = async (userId) => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/admin/user-stats/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserStats(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch user statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  useEffect(() => {
    if (tabValue === 0) {
      fetchGlobalLeaderboard();
    } else if (tabValue === 1 && selectedQuiz) {
      fetchQuizLeaderboard();
    }
  }, [tabValue, selectedQuiz, limit]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Show loading if still checking authentication
  if (!user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  // Show unauthorized message if not admin
  if (!isAdmin()) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          You don't have permission to access this page.
        </Alert>
        <Button variant="contained" onClick={() => window.location.href = '/'}>
          Return to Home
        </Button>
      </Container>
    );
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ backgroundColor: '#121212', minHeight: '100vh', color: 'white' }}>
        <AppBar position="static" elevation={0}>
          <Toolbar>
            <Leaderboard sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Quiz Admin Dashboard
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: 'secondary.main' }}>
                {user.username?.charAt(0).toUpperCase() || 'A'}
              </Avatar>
              <Typography variant="body1" sx={{ mr: 2 }}>
                {user.username} (Admin)
              </Typography>
              <IconButton color="inherit" onClick={handleLogout}>
                <Logout />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom color="primary">
            Admin Leaderboard
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          <Paper elevation={3} sx={{ mb: 2 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange} 
                aria-label="leaderboard tabs"
                textColor="primary"
                indicatorColor="primary"
              >
                <Tab label="Global Leaderboard" />
                <Tab label="Quiz Leaderboard" />
                <Tab label="User Statistics" />
              </Tabs>
            </Box>
          </Paper>

          <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <FormControl sx={{ minWidth: 120 }} size="small">
                <InputLabel id="limit-select-label" sx={{ color: 'text.primary' }}>Results</InputLabel>
                <Select
                  labelId="limit-select-label"
                  value={limit}
                  label="Results"
                  onChange={(e) => setLimit(e.target.value)}
                  sx={{ color: 'text.primary' }}
                >
                  <MenuItem value={5}>Top 5</MenuItem>
                  <MenuItem value={10}>Top 10</MenuItem>
                  <MenuItem value={25}>Top 25</MenuItem>
                  <MenuItem value={50}>Top 50</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Paper>

          <TabPanel value={tabValue} index={0}>
            <Typography variant="h5" gutterBottom color="primary">
              Global Leaderboard
            </Typography>
            
            {loading ? (
              <Box display="flex" justifyContent="center" my={4}>
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer component={Paper} elevation={3}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>Rank</TableCell>
                      <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>User</TableCell>
                      <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>Email</TableCell>
                      <TableCell align="right" sx={{ color: 'text.primary', fontWeight: 'bold' }}>Total Score</TableCell>
                      <TableCell align="right" sx={{ color: 'text.primary', fontWeight: 'bold' }}>Quizzes Taken</TableCell>
                      <TableCell align="right" sx={{ color: 'text.primary', fontWeight: 'bold' }}>Average Score</TableCell>
                      <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>Last Activity</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {globalLeaderboard.map((user) => (
                      <StyledTableRow key={user._id} rank={user.rank}>
                        <TableCell>
                          <Chip 
                            label={`#${user.rank}`} 
                            color={
                              user.rank === 1 ? 'primary' : 
                              user.rank <= 3 ? 'secondary' : 'default'
                            }
                          />
                        </TableCell>
                        <TableCell sx={{ color: 'text.primary' }}>{user.username}</TableCell>
                        <TableCell sx={{ color: 'text.primary' }}>{user.email}</TableCell>
                        <TableCell align="right" sx={{ color: 'text.primary' }}>{user.totalScore}</TableCell>
                        <TableCell align="right" sx={{ color: 'text.primary' }}>{user.totalQuizzes}</TableCell>
                        <TableCell align="right">
                          <ScoreChip 
                            score={user.averageScore} 
                            label={`${user.averageScore}%`} 
                          />
                        </TableCell>
                        <TableCell sx={{ color: 'text.primary' }}>{formatDate(user.lastActivity)}</TableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Typography variant="h5" gutterBottom color="primary">
              Quiz Leaderboard
            </Typography>
            
            <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
              <FormControl fullWidth>
                <InputLabel id="quiz-select-label" sx={{ color: 'text.primary' }}>Select Quiz</InputLabel>
                <Select
                  labelId="quiz-select-label"
                  value={selectedQuiz}
                  label="Select Quiz"
                  onChange={(e) => setSelectedQuiz(e.target.value)}
                  sx={{ color: 'text.primary' }}
                >
                  {quizzes.map((quiz) => (
                    <MenuItem key={quiz._id} value={quiz._id}>
                      {quiz.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Paper>
            
            {loading ? (
              <Box display="flex" justifyContent="center" my={4}>
                <CircularProgress />
              </Box>
            ) : selectedQuiz && quizLeaderboard.length > 0 ? (
              <TableContainer component={Paper} elevation={3}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>Rank</TableCell>
                      <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>User</TableCell>
                      <TableCell align="right" sx={{ color: 'text.primary', fontWeight: 'bold' }}>Best Score</TableCell>
                      <TableCell align="right" sx={{ color: 'text.primary', fontWeight: 'bold' }}>Attempts</TableCell>
                      <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>Best Score Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {quizLeaderboard.map((user) => (
                      <StyledTableRow key={user._id} rank={user.rank}>
                        <TableCell>
                          <Chip 
                            label={`#${user.rank}`} 
                            color={
                              user.rank === 1 ? 'primary' : 
                              user.rank <= 3 ? 'secondary' : 'default'
                            }
                          />
                        </TableCell>
                        <TableCell sx={{ color: 'text.primary' }}>{user.username}</TableCell>
                        <TableCell align="right">
                          <ScoreChip 
                            score={user.bestScore} 
                            label={`${user.bestScore}%`} 
                          />
                        </TableCell>
                        <TableCell align="right" sx={{ color: 'text.primary' }}>{user.totalAttempts}</TableCell>
                        <TableCell sx={{ color: 'text.primary' }}>{formatDate(user.bestScoreDate)}</TableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="body1" color="textSecondary">
                  {selectedQuiz ? 'No data available for this quiz' : 'Please select a quiz to view its leaderboard'}
                </Typography>
              </Paper>
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Typography variant="h5" gutterBottom color="primary">
              User Statistics
            </Typography>
            
            <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="Enter User ID"
                  variant="outlined"
                  value={userIdSearch}
                  onChange={(e) => setUserIdSearch(e.target.value)}
                  sx={{ flexGrow: 1 }}
                  InputLabelProps={{ style: { color: 'text.primary' } }}
                />
                <Button 
                  variant="contained" 
                  onClick={() => fetchUserStats(userIdSearch)}
                  disabled={!userIdSearch}
                >
                  Search
                </Button>
              </Box>
            </Paper>
            
            {loading ? (
              <Box display="flex" justifyContent="center" my={4}>
                <CircularProgress />
              </Box>
            ) : userStats ? (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card elevation={3}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom color="primary">
                        Overall Statistics
                      </Typography>
                      <Box>
                        <Typography variant="body2" sx={{ mb: 1, color: 'text.primary' }}>
                          <strong>Rank:</strong> {userStats.rank ? `#${userStats.rank}` : 'N/A'}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1, color: 'text.primary' }}>
                          <strong>Total Submissions:</strong> {userStats.stats.totalSubmissions}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1, color: 'text.primary' }}>
                          <strong>Total Score:</strong> {userStats.stats.totalScore}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1, color: 'text.primary' }}>
                          <strong>Average Score:</strong>{' '}
                          <ScoreChip 
                            score={userStats.stats.averageScore} 
                            label={`${userStats.stats.averageScore.toFixed(2)}%`} 
                            size="small"
                          />
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1, color: 'text.primary' }}>
                          <strong>Best Score:</strong>{' '}
                          <ScoreChip 
                            score={userStats.stats.bestScore} 
                            label={`${userStats.stats.bestScore}%`} 
                            size="small"
                          />
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.primary' }}>
                          <strong>Worst Score:</strong>{' '}
                          <ScoreChip 
                            score={userStats.stats.worstScore} 
                            label={`${userStats.stats.worstScore}%`} 
                            size="small"
                          />
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }} color="primary">
                    Quiz Breakdown
                  </Typography>
                  <TableContainer component={Paper} elevation={3}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>Quiz Title</TableCell>
                          <TableCell align="right" sx={{ color: 'text.primary', fontWeight: 'bold' }}>Attempts</TableCell>
                          <TableCell align="right" sx={{ color: 'text.primary', fontWeight: 'bold' }}>Best Score</TableCell>
                          <TableCell align="right" sx={{ color: 'text.primary', fontWeight: 'bold' }}>Average Score</TableCell>
                          <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>Last Attempt</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {userStats.quizBreakdown.map((quiz) => (
                          <TableRow key={quiz._id}>
                            <TableCell sx={{ color: 'text.primary' }}>{quiz.quizTitle}</TableCell>
                            <TableCell align="right" sx={{ color: 'text.primary' }}>{quiz.attempts}</TableCell>
                            <TableCell align="right">
                              <ScoreChip 
                                score={quiz.bestScore} 
                                label={`${quiz.bestScore}%`} 
                                size="small"
                              />
                            </TableCell>
                            <TableCell align="right">
                              <ScoreChip 
                                score={quiz.averageScore} 
                                label={`${quiz.averageScore.toFixed(2)}%`} 
                                size="small"
                              />
                            </TableCell>
                            <TableCell sx={{ color: 'text.primary' }}>{formatDate(quiz.lastAttempt)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            ) : (
              <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="body1" color="textSecondary">
                  Enter a User ID to view their statistics
                </Typography>
              </Paper>
            )}
          </TabPanel>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default AdminLeaderboard;