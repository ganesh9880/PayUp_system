import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  IconButton,
  InputAdornment,
  Fade,
  Grow,
  Slide,
  AppBar,
  Toolbar,
  Chip,
  Avatar,
  Autocomplete,
  Grid,
  Divider,
  MenuItem,
  CircularProgress,
  Checkbox,
} from '@mui/material';
import {
  ArrowBack,
  Group,
  Add,
  Person,
  Payment,
  Description,
  Create,
  People,
} from '@mui/icons-material';
import { useAuth } from '../components/AuthContext';
import { createGroup, getUsers } from '../api/api';

const CreateGroup = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    upiId: '',
    members: [],
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingUsers, setFetchingUsers] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  // Debug useEffect to monitor formData changes
  useEffect(() => {
    console.log('🔄 formData changed:', formData);
    console.log('🔄 formData.members:', formData.members);
    console.log('🔄 formData.members.length:', formData.members?.length);
  }, [formData]);

  const fetchUsers = async () => {
    try {
      setFetchingUsers(true);
      console.log('Fetching users...');
      const usersData = await getUsers();
      console.log('Fetched users:', usersData);
      // Filter out the current user from the list
      const filteredUsers = usersData.filter(u => u._id !== user._id);
      console.log('Filtered users (excluding current user):', filteredUsers);
      setUsers(filteredUsers);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setUsers([]);
    } finally {
      setFetchingUsers(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log('=== FORM SUBMISSION DEBUG ===');
    console.log('Form data before validation:', formData);
    console.log('formData.members:', formData.members);
    console.log('formData.members.length:', formData.members?.length);
    console.log('formData.members type:', typeof formData.members);
    console.log('Is formData.members array?', Array.isArray(formData.members));

    if (!formData.name.trim()) {
      setError('Please enter a group name');
      setLoading(false);
      return;
    }

    if (!formData.members || formData.members.length === 0) {
      console.log('❌ Validation failed: No members selected');
      setError('Please select at least one member');
      setLoading(false);
      return;
    }

    console.log('✅ Validation passed, proceeding with group creation');

    try {
      const groupData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        upiId: formData.upiId.trim(),
        members: formData.members.map(m => m._id),
      };

      console.log('Sending group data:', groupData);
      console.log('Selected members:', formData.members);

      await createGroup(groupData);
      navigate('/dashboard');
    } catch (err) {
      console.error('Error creating group:', err);
      setError(err.response?.data?.message || 'Failed to create group');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = () => {
    console.log('Select All clicked. Available users:', users);
    console.log('Current formData.members:', formData.members);
    console.log('Users array length:', users.length);
    
    if (users.length === 0) {
      console.log('No users available to select');
      return;
    }
    
    // Force immediate state update
    const newMembers = [...users];
    console.log('Setting new members:', newMembers);
    
    setFormData(prev => {
      const newState = {
        ...prev,
        members: newMembers
      };
      console.log('New state will be:', newState);
      return newState;
    });
    
    // Force a re-render by updating error state
    setError('');
    
    // Additional check after state update
    setTimeout(() => {
      console.log('After timeout - formData.members:', formData.members);
    }, 100);
  };

  const handleClearAll = () => {
    console.log('Clear All clicked. Clearing all members.');
    setFormData(prev => ({
      ...prev,
      members: []
    }));
    setError('');
  };

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
          <IconButton
            edge="start"
            onClick={() => navigate('/dashboard')}
            sx={{ color: '#667eea', mr: 2 }}
          >
            <ArrowBack />
          </IconButton>
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
            Create New Group
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 4 }}>
        <Slide direction="up" in={true} timeout={800}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                mx: 'auto',
                mb: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              }}
            >
              <Group sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                mb: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Create New Group
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontWeight: 400,
                letterSpacing: 1,
              }}
            >
              Start managing expenses with your friends and family
            </Typography>
          </Box>
        </Slide>

        <Grow in={true} timeout={1000}>
          <Card
            sx={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: 4,
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
              },
            }}
          >
            <CardContent sx={{ p: 4 }}>
              {error && (
                <Fade in={true}>
                  <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                    {error}
                  </Alert>
                </Fade>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      name="name"
                      label="Group Name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter group name"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Group sx={{ color: '#667eea' }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      name="upiId"
                      label="Your UPI ID (Optional)"
                      value={formData.upiId}
                      onChange={handleChange}
                      placeholder="yourname@upi"
                      helperText="Add your UPI ID to enable easy settlements"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Payment sx={{ color: '#667eea' }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name="description"
                      label="Description (Optional)"
                      value={formData.description}
                      onChange={handleChange}
                      multiline
                      rows={3}
                      placeholder="Describe what this group is for"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Description sx={{ color: '#667eea' }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                          Add Members
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={handleSelectAll}
                            disabled={fetchingUsers}
                            sx={{
                              borderColor: '#667eea',
                              color: '#667eea',
                              '&:hover': {
                                borderColor: '#5a6fd8',
                                backgroundColor: 'rgba(102, 126, 234, 0.04)',
                              },
                            }}
                          >
                            Select All
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={handleClearAll}
                            sx={{
                              borderColor: '#f093fb',
                              color: '#f093fb',
                              '&:hover': {
                                borderColor: '#e666f0',
                                backgroundColor: 'rgba(240, 147, 251, 0.04)',
                              },
                            }}
                          >
                            Clear All
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => {
                              console.log('=== DEBUG INFO ===');
                              console.log('Users:', users);
                              console.log('FormData members:', formData.members);
                              console.log('Fetching users:', fetchingUsers);
                              alert(`Users: ${users.length}, Selected: ${formData.members.length}`);
                            }}
                            sx={{
                              borderColor: '#ff9800',
                              color: '#ff9800',
                              '&:hover': {
                                borderColor: '#f57c00',
                                backgroundColor: 'rgba(255, 152, 0, 0.04)',
                              },
                            }}
                          >
                            Debug
                          </Button>
                        </Box>
                      </Box>

                      {/* Member Selection with Checkboxes */}
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: '#2c3e50' }}>
                          Select Members ({formData.members.length} selected)
                        </Typography>
                        
                        {fetchingUsers ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CircularProgress size={20} />
                            <Typography variant="body2">Loading users...</Typography>
                          </Box>
                        ) : users.length === 0 ? (
                          <Typography variant="body2" sx={{ color: '#666' }}>
                            No users available to add
                          </Typography>
                        ) : (
                          <Box sx={{ maxHeight: 200, overflowY: 'auto', border: '1px solid #e0e0e0', borderRadius: 1, p: 1 }}>
                            {users.map((user) => (
                              <Box
                                key={user._id}
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  p: 1,
                                  borderRadius: 1,
                                  cursor: 'pointer',
                                  '&:hover': {
                                    bgcolor: 'rgba(102, 126, 234, 0.04)',
                                  },
                                  bgcolor: formData.members.find(m => m._id === user._id) 
                                    ? 'rgba(102, 126, 234, 0.1)' 
                                    : 'transparent'
                                }}
                                onClick={() => {
                                  const isSelected = formData.members.find(m => m._id === user._id);
                                  setFormData(prev => ({
                                    ...prev,
                                    members: isSelected
                                      ? prev.members.filter(m => m._id !== user._id)
                                      : [...prev.members, user]
                                  }));
                                  setError('');
                                }}
                              >
                                <Checkbox
                                  checked={!!formData.members.find(m => m._id === user._id)}
                                  sx={{
                                    color: '#667eea',
                                    '&.Mui-checked': {
                                      color: '#667eea',
                                    },
                                  }}
                                />
                                <Avatar
                                  sx={{
                                    width: 32,
                                    height: 32,
                                    mr: 2,
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    fontSize: '0.9rem',
                                  }}
                                >
                                  {user.name.charAt(0).toUpperCase()}
                                </Avatar>
                                <Box>
                                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    {user.name}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: '#7f8c8d' }}>
                                    {user.whatsapp}
                                  </Typography>
                                </Box>
                              </Box>
                            ))}
                          </Box>
                        )}
                      </Box>
                      
                      {/* Validation message */}
                      {formData.members.length === 0 && !fetchingUsers && (
                        <Typography variant="caption" sx={{ color: '#d32f2f', mt: 1, display: 'block' }}>
                          ⚠️ Please select at least one member
                        </Typography>
                      )}
                      
                      {formData.members.length > 0 && (
                        <Typography variant="caption" sx={{ color: '#2e7d32', mt: 1, display: 'block' }}>
                          ✅ {formData.members.length} member(s) selected
                        </Typography>
                      )}
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        startIcon={<Create />}
                        sx={{
                          py: 1.5,
                          px: 4,
                          fontSize: '1.1rem',
                          fontWeight: 600,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                            transform: 'translateY(-2px)',
                          },
                          '&:disabled': {
                            background: '#bdc3c7',
                          },
                        }}
                      >
                        {loading ? 'Creating Group...' : 'Create Group'}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grow>

        {/* Features Preview */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography
            variant="h6"
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontWeight: 600,
              mb: 2,
            }}
          >
            What you'll get:
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Chip
              icon={<Person />}
              label="Add members"
              sx={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                backdropFilter: 'blur(10px)',
              }}
            />
            <Chip
              icon={<Payment />}
              label="Track expenses"
              sx={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                backdropFilter: 'blur(10px)',
              }}
            />
            <Chip
              icon={<Group />}
              label="Split bills"
              sx={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                backdropFilter: 'blur(10px)',
              }}
            />
            <Chip
              icon={<Add />}
              label="WhatsApp reminders"
              sx={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                backdropFilter: 'blur(10px)',
              }}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default CreateGroup; 