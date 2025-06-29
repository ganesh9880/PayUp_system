import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Autocomplete,
  Chip,
  Fade,
  Grow,
  CircularProgress,
  InputAdornment,
  Divider,
  Grid,
  Avatar,
  Checkbox,
} from '@mui/material';
import {
  AttachMoney,
  Description,
  Person,
  Group,
  Add,
  CheckCircle,
} from '@mui/icons-material';
import { createExpense } from '../api/api';

const ExpenseForm = ({ group, onAdded }) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    paidBy: null,
    participants: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!formData.description || !formData.amount || !formData.paidBy || formData.participants.length === 0) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      const expenseData = {
        description: formData.description,
        amount: parseFloat(formData.amount),
        paidBy: formData.paidBy._id,
        participants: formData.participants.map(p => p._id),
      };

      await createExpense(group._id, expenseData);
      
      setSuccess('Expense added successfully!');
      setFormData({
        description: '',
        amount: '',
        paidBy: null,
        participants: [],
      });
      
      if (onAdded) {
        onAdded();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = () => {
    console.log('ExpenseForm Select All clicked. Available members:', group.members);
    console.log('Current formData.participants:', formData.participants);
    console.log('Group members array length:', group.members?.length || 0);
    
    if (!group.members || group.members.length === 0) {
      console.log('No group members available to select');
      return;
    }
    
    // Select all group members
    setFormData(prev => {
      const newState = {
        ...prev,
        participants: [...group.members]
      };
      console.log('ExpenseForm Select All - New state:', newState);
      return newState;
    });
    setError('');
    setSuccess('');
  };

  const handleClearAll = () => {
    console.log('ExpenseForm Clear All clicked. Clearing all participants.');
    setFormData(prev => ({
      ...prev,
      participants: []
    }));
    setError('');
    setSuccess('');
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {error && (
        <Fade in={true}>
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        </Fade>
      )}

      {success && (
        <Fade in={true}>
          <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
            {success}
          </Alert>
        </Fade>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Grow in={true} timeout={800}>
            <TextField
              fullWidth
              name="description"
              label="Expense Description"
              value={formData.description}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Description sx={{ color: '#667eea' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grow>
        </Grid>

        <Grid item xs={12} md={6}>
          <Grow in={true} timeout={1000}>
            <TextField
              fullWidth
              name="amount"
              label="Amount (₹)"
              type="number"
              value={formData.amount}
              onChange={handleChange}
              required
              inputProps={{ min: 0, step: 0.01 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AttachMoney sx={{ color: '#667eea' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grow>
        </Grid>

        <Grid item xs={12} md={6}>
          <Grow in={true} timeout={1200}>
            <Autocomplete
              options={group.members || []}
              getOptionLabel={(option) => `${option.name} (${option.whatsapp})`}
              value={formData.paidBy}
              onChange={(_, value) => {
                setFormData(prev => ({
                  ...prev,
                  paidBy: value
                }));
                setError('');
                setSuccess('');
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Paid By"
                  required
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: '#667eea' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar
                      sx={{
                        width: 24,
                        height: 24,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        fontSize: '0.8rem',
                      }}
                    >
                      {option.name.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {option.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#7f8c8d' }}>
                        {option.whatsapp}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )}
            />
          </Grow>
        </Grid>

        <Grid item xs={12}>
          <Grow in={true} timeout={1400}>
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                  Participants
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={handleSelectAll}
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
                      console.log('=== EXPENSEFORM DEBUG INFO ===');
                      console.log('Group members:', group.members);
                      console.log('FormData participants:', formData.participants);
                      alert(`Group members: ${group.members?.length || 0}, Selected participants: ${formData.participants?.length || 0}`);
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

              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: '#2c3e50' }}>
                  Select Participants ({formData.participants?.length || 0} selected)
                </Typography>
                
                {!group.members || group.members.length === 0 ? (
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    No group members available
                  </Typography>
                ) : (
                  <Box sx={{ maxHeight: 200, overflowY: 'auto', border: '1px solid #e0e0e0', borderRadius: 1, p: 1 }}>
                    {group.members.map((member) => (
                      <Box
                        key={member._id}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          p: 1,
                          borderRadius: 1,
                          cursor: 'pointer',
                          '&:hover': {
                            bgcolor: 'rgba(102, 126, 234, 0.04)',
                          },
                          bgcolor: formData.participants?.find(p => p._id === member._id) 
                            ? 'rgba(102, 126, 234, 0.1)' 
                            : 'transparent'
                        }}
                        onClick={() => {
                          const isSelected = formData.participants?.find(p => p._id === member._id);
                          setFormData(prev => ({
                            ...prev,
                            participants: isSelected
                              ? (prev.participants || []).filter(p => p._id !== member._id)
                              : [...(prev.participants || []), member]
                          }));
                          setError('');
                          setSuccess('');
                        }}
                      >
                        <Checkbox
                          checked={!!formData.participants?.find(p => p._id === member._id)}
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
                          {member.name.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {member.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#7f8c8d' }}>
                            {member.whatsapp}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
              
              {(!formData.participants || formData.participants.length === 0) && (
                <Typography variant="caption" sx={{ color: '#d32f2f', mt: 1, display: 'block' }}>
                  ⚠️ Please select at least one participant
                </Typography>
              )}
              
              {formData.participants && formData.participants.length > 0 && (
                <Typography variant="caption" sx={{ color: '#2e7d32', mt: 1, display: 'block' }}>
                  ✅ {formData.participants.length} participant(s) selected
                </Typography>
              )}
            </Box>
          </Grow>
        </Grid>

        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
          <Grow in={true} timeout={1600}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <Add />}
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
                {loading ? 'Adding Expense...' : 'Add Expense'}
              </Button>
            </Box>
          </Grow>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ExpenseForm; 