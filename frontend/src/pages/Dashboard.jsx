import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  Avatar,
  IconButton,
  AppBar,
  Toolbar,
  Fade,
  Grow,
  Slide,
  Fab,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Add,
  Group,
  AccountBalance,
  Notifications,
  Logout,
  Person,
  TrendingUp,
  TrendingDown,
  WhatsApp,
  Payment,
  ArrowForward,
  Refresh,
} from '@mui/icons-material';
import { useAuth } from '../components/AuthContext';
import { getGroups, getBalances } from '../api/api';

const Dashboard = () => {
  const [groups, setGroups] = useState([]);
  const [balances, setBalances] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [groupsData, balancesData] = await Promise.all([
        getGroups(),
        getBalances(),
      ]);
      setGroups(groupsData);
      setBalances(balancesData);
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getTotalBalance = () => {
    return Object.values(balances).reduce((sum, balance) => sum + balance, 0);
  };

  const getGroupBalance = (groupId) => {
    return balances[groupId] || 0;
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar
        position="static"
        sx={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            PayUp
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={fetchData} sx={{ color: '#667eea' }}>
              <Refresh />
            </IconButton>
            <IconButton onClick={handleLogout} sx={{ color: '#667eea' }}>
              <Logout />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {error && (
          <Fade in={true}>
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          </Fade>
        )}

        {/* Welcome Section */}
        <Slide direction="down" in={true} timeout={800}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                mb: 2,
                color: '#2c3e50',
              }}
            >
              Welcome back, {user?.name}! 👋
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: '#7f8c8d',
                fontWeight: 400,
                letterSpacing: 1,
              }}
            >
              Manage your group expenses with ease
            </Typography>
          </Box>
        </Slide>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Grow in={true} timeout={1000}>
              <Card
                sx={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: 4,
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                  overflow: 'hidden',
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                  },
                }}
              >
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <Avatar
                    sx={{
                      width: 60,
                      height: 60,
                      mx: 'auto',
                      mb: 2,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    }}
                  >
                    <Group sx={{ fontSize: 30 }} />
                  </Avatar>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    {groups.length}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                    Active Groups
                  </Typography>
                </CardContent>
              </Card>
            </Grow>
          </Grid>

          <Grid item xs={12} md={4}>
            <Grow in={true} timeout={1200}>
              <Card
                sx={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: 4,
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                  overflow: 'hidden',
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)',
                  },
                }}
              >
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <Avatar
                    sx={{
                      width: 60,
                      height: 60,
                      mx: 'auto',
                      mb: 2,
                      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    }}
                  >
                    <AccountBalance sx={{ fontSize: 30 }} />
                  </Avatar>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    ₹{Math.abs(getTotalBalance()).toFixed(2)}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                    {getTotalBalance() >= 0 ? 'You are owed' : 'You owe'}
                  </Typography>
                </CardContent>
              </Card>
            </Grow>
          </Grid>

          <Grid item xs={12} md={4}>
            <Grow in={true} timeout={1400}>
              <Card
                sx={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: 4,
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                  overflow: 'hidden',
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(90deg, #f093fb 0%, #f5576c 100%)',
                  },
                }}
              >
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <Avatar
                    sx={{
                      width: 60,
                      height: 60,
                      mx: 'auto',
                      mb: 2,
                      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    }}
                  >
                    <Notifications sx={{ fontSize: 30 }} />
                  </Avatar>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    {groups.filter(g => g.upiId).length}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                    Groups with UPI
                  </Typography>
                </CardContent>
              </Card>
            </Grow>
          </Grid>
        </Grid>

        {/* Groups Section */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 600,
                color: '#2c3e50',
              }}
            >
              Your Groups
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate('/create-group')}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              Create Group
            </Button>
          </Box>

          {groups.length === 0 ? (
            <Grow in={true} timeout={1600}>
              <Card
                sx={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: 4,
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                  textAlign: 'center',
                  py: 6,
                }}
              >
                <Typography variant="h6" sx={{ color: '#7f8c8d', mb: 2 }}>
                  No groups yet
                </Typography>
                <Typography variant="body2" sx={{ color: '#7f8c8d', mb: 3 }}>
                  Create your first group to start managing expenses
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => navigate('/create-group')}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  Create Your First Group
                </Button>
              </Card>
            </Grow>
          ) : (
            <Grid container spacing={3}>
              {groups.map((group, index) => (
                <Grid item xs={12} md={6} lg={4} key={group._id}>
                  <Grow in={true} timeout={1600 + index * 200}>
                    <Card
                      sx={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: 4,
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                        },
                      }}
                      onClick={() => navigate(`/group/${group._id}`)}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                            {group.name}
                          </Typography>
                          <IconButton size="small" sx={{ color: '#667eea' }}>
                            <ArrowForward />
                          </IconButton>
                        </Box>

                        <Typography variant="body2" sx={{ color: '#7f8c8d', mb: 2 }}>
                          {group.members.length} members
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <Chip
                            label={getGroupBalance(group._id) >= 0 ? 'You are owed' : 'You owe'}
                            color={getGroupBalance(group._id) >= 0 ? 'success' : 'warning'}
                            size="small"
                            icon={getGroupBalance(group._id) >= 0 ? <TrendingUp /> : <TrendingDown />}
                          />
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                            ₹{Math.abs(getGroupBalance(group._id)).toFixed(2)}
                          </Typography>
                        </Box>

                        {group.upiId && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Payment sx={{ fontSize: 16, color: '#667eea' }} />
                            <Typography variant="caption" sx={{ color: '#7f8c8d' }}>
                              UPI: {group.upiId}
                            </Typography>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grow>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

        {/* Floating Action Button */}
        <Fab
          color="primary"
          aria-label="add"
          onClick={() => navigate('/create-group')}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
              transform: 'scale(1.1)',
            },
          }}
        >
          <Add />
        </Fab>
      </Container>
    </Box>
  );
};

export default Dashboard; 