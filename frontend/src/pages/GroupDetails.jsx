import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Alert,
  AppBar,
  Toolbar,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Avatar,
  Fade,
  Grow,
  Slide,
  Fab,
  ListItemAvatar,
  ListItemSecondaryAction,
  Paper,
} from '@mui/material';
import {
  ArrowBack,
  Add,
  Group,
  Payment,
  AccountBalance,
  TrendingUp,
  TrendingDown,
  WhatsApp,
  Person,
  Description,
  Refresh,
  CheckCircle,
  Pending,
  AttachMoney,
} from '@mui/icons-material';
import { getGroupDetails, updateSettlement, sendReminders } from '../api/api';
import ExpenseForm from '../components/ExpenseForm';

const GroupDetails = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    fetchGroupDetails();
  }, [groupId, refresh]);

  const fetchGroupDetails = async () => {
    setLoading(true);
    try {
      const data = await getGroupDetails(groupId);
      setGroup(data);
      setError('');
    } catch (err) {
      setError('Failed to load group details');
      console.error('Error fetching group:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExpenseAdded = () => setRefresh(r => !r);

  const markSettlementAsSettled = async (expenseId, settlementId) => {
    try {
      await updateSettlement(groupId, expenseId, settlementId, { settled: true });
      setRefresh(r => !r);
    } catch (err) {
      alert('Failed to mark settlement as settled. Please try again.');
      console.error('Settlement error:', err);
    }
  };

  const markSettlementAsPending = async (expenseId, settlementId) => {
    try {
      await updateSettlement(groupId, expenseId, settlementId, { settled: false });
      setRefresh(r => !r);
    } catch (err) {
      alert('Failed to mark settlement as pending. Please try again.');
      console.error('Settlement error:', err);
    }
  };

  const markAllPendingAsSettled = async () => {
    if (pendingSettlements.length === 0) {
      alert('No pending settlements to mark as settled.');
      return;
    }
    
    if (!confirm(`Mark all ${pendingSettlements.length} pending settlements as settled?`)) {
      return;
    }

    try {
      const promises = pendingSettlements.map(settlement => {
        const expense = group.expenses.find(exp => 
          exp.settlements?.some(s => s._id === settlement._id)
        );
        if (expense) {
          return updateSettlement(groupId, expense._id, settlement._id, { settled: true });
        }
        return Promise.resolve();
      });
      
      await Promise.all(promises);
      setRefresh(r => !r);
      alert(`Successfully marked ${pendingSettlements.length} settlements as settled!`);
    } catch (err) {
      alert('Failed to mark some settlements as settled. Please try again.');
      console.error('Bulk settlement error:', err);
    }
  };

  const markAllSettledAsPending = async () => {
    if (settledSettlements.length === 0) {
      alert('No settled settlements to mark as pending.');
      return;
    }
    
    if (!confirm(`Mark all ${settledSettlements.length} settled settlements as pending?`)) {
      return;
    }

    try {
      const promises = settledSettlements.map(settlement => {
        const expense = group.expenses.find(exp => 
          exp.settlements?.some(s => s._id === settlement._id)
        );
        if (expense) {
          return updateSettlement(groupId, expense._id, settlement._id, { settled: false });
        }
        return Promise.resolve();
      });
      
      await Promise.all(promises);
      setRefresh(r => !r);
      alert(`Successfully marked ${settledSettlements.length} settlements as pending!`);
    } catch (err) {
      alert('Failed to mark some settlements as pending. Please try again.');
      console.error('Bulk settlement error:', err);
    }
  };

  const handleSendReminders = async () => {
    try {
      const result = await sendReminders(groupId);
      const successCount = result.results.filter(r => r.status === 'sent').length;
      const failedCount = result.results.filter(r => r.status === 'failed').length;
      const totalMembers = result.results.length;
      
      let message = `Reminders sent successfully! 📱\n\n`;
      message += `📊 Summary:\n`;
      message += `✅ Sent: ${successCount} members\n`;
      message += `❌ Failed: ${failedCount} members\n`;
      message += `📋 Total processed: ${totalMembers} members\n\n`;
      
      if (totalMembers === 0) {
        message += `ℹ️ No reminders sent because no members owe money.\n`;
        message += `This means all balances are settled or positive.`;
      } else if (failedCount > 0) {
        message += `⚠️ Some messages failed to send. Check the console for details.`;
      }
      
      alert(message);
      console.log('Reminder results:', result.results);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to send reminders. Please try again.';
      alert(`Error: ${errorMessage}`);
      console.error('Reminder error:', err);
    }
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

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Fade in={true}>
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        </Fade>
        <Button
          variant="contained"
          onClick={() => navigate('/dashboard')}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
            },
          }}
        >
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  if (!group) return null;

  const allSettlements = group.expenses?.flatMap(exp => exp.settlements || []) || [];
  const pendingSettlements = allSettlements.filter(s => !s.settled);
  const settledSettlements = allSettlements.filter(s => s.settled);
  const totalPending = pendingSettlements.reduce((sum, s) => sum + s.amount, 0);
  const totalSettled = settledSettlements.reduce((sum, s) => sum + s.amount, 0);

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
            {group.name}
          </Typography>
          <IconButton onClick={fetchGroupDetails} sx={{ color: '#667eea' }}>
            <Refresh />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header Section */}
        <Slide direction="down" in={true} timeout={800}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
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
              {group.name}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontWeight: 400,
                letterSpacing: 1,
                mb: 2,
              }}
            >
              {group.description || 'No description'}
            </Typography>
            {group.upiId && (
              <Chip
                icon={<Payment />}
                label={`UPI: ${group.upiId}`}
                sx={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  backdropFilter: 'blur(10px)',
                  fontSize: '0.9rem',
                }}
              />
            )}
          </Box>
        </Slide>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
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
                      width: 50,
                      height: 50,
                      mx: 'auto',
                      mb: 2,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    }}
                  >
                    <Group sx={{ fontSize: 24 }} />
                  </Avatar>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    {group.members?.length || 0}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                    Members
                  </Typography>
                </CardContent>
              </Card>
            </Grow>
          </Grid>

          <Grid item xs={12} md={3}>
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
                      width: 50,
                      height: 50,
                      mx: 'auto',
                      mb: 2,
                      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    }}
                  >
                    <AttachMoney sx={{ fontSize: 24 }} />
                  </Avatar>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    {group.expenses?.length || 0}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                    Expenses
                  </Typography>
                </CardContent>
              </Card>
            </Grow>
          </Grid>

          <Grid item xs={12} md={3}>
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
                    background: 'linear-gradient(90deg, #fa709a 0%, #fee140 100%)',
                  },
                }}
              >
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <Avatar
                    sx={{
                      width: 50,
                      height: 50,
                      mx: 'auto',
                      mb: 2,
                      background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                    }}
                  >
                    <Pending sx={{ fontSize: 24 }} />
                  </Avatar>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    {pendingSettlements.length}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                    Pending
                  </Typography>
                </CardContent>
              </Card>
            </Grow>
          </Grid>

          <Grid item xs={12} md={3}>
            <Grow in={true} timeout={1600}>
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
                      width: 50,
                      height: 50,
                      mx: 'auto',
                      mb: 2,
                      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    }}
                  >
                    <CheckCircle sx={{ fontSize: 24 }} />
                  </Avatar>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    {settledSettlements.length}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                    Settled
                  </Typography>
                </CardContent>
              </Card>
            </Grow>
          </Grid>
        </Grid>

        {/* Members Section */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              color: '#2c3e50',
              mb: 3,
            }}
          >
            Members
          </Typography>
          <Grid container spacing={3}>
            {group.members?.map((member, index) => (
              <Grid item xs={12} sm={6} md={4} key={member._id}>
                <Grow in={true} timeout={1800 + index * 200}>
                  <Card
                    sx={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(20px)',
                      borderRadius: 4,
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
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
                          fontSize: '1.5rem',
                        }}
                      >
                        {member.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        {member.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#7f8c8d', mb: 2 }}>
                        {member.whatsapp}
                      </Typography>
                      <Chip
                        label={
                          member.balance < 0
                            ? `Owes ₹${-member.balance}`
                            : member.balance > 0
                              ? `Gets ₹${member.balance}`
                              : 'Settled'
                        }
                        color={member.balance < 0 ? 'error' : member.balance > 0 ? 'success' : 'default'}
                        icon={member.balance < 0 ? <TrendingDown /> : member.balance > 0 ? <TrendingUp /> : <CheckCircle />}
                        sx={{ fontWeight: 600 }}
                      />
                    </CardContent>
                  </Card>
                </Grow>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Expenses Section */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              color: '#2c3e50',
              mb: 3,
            }}
          >
            Expenses
          </Typography>
          {group.expenses?.length === 0 ? (
            <Grow in={true} timeout={2000}>
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
                  No expenses yet
                </Typography>
                <Typography variant="body2" sx={{ color: '#7f8c8d', mb: 3 }}>
                  Add the first expense to get started!
                </Typography>
              </Card>
            </Grow>
          ) : (
            <List>
              {group.expenses?.map((exp, index) => (
                <Grow in={true} timeout={2000 + index * 200} key={exp._id}>
                  <Card
                    sx={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(20px)',
                      borderRadius: 4,
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                      mb: 2,
                      overflow: 'hidden',
                      position: 'relative',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '3px',
                        background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                            {exp.description}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                            Paid by: {exp.paidBy?.name || 'Unknown'} | Participants: {exp.participants?.length || 0}
                          </Typography>
                        </Box>
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: 700,
                            color: '#667eea',
                          }}
                        >
                          ₹{exp.amount}
                        </Typography>
                      </Box>

                      {/* Settlements */}
                      {exp.settlements && exp.settlements.length > 0 && (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="body2" sx={{ color: '#7f8c8d', mb: 2, fontWeight: 600 }}>
                            Settlements:
                          </Typography>
                          {exp.settlements.map((settlement, sIndex) => (
                            <Paper
                              key={sIndex}
                              sx={{
                                p: 2,
                                mb: 1,
                                background: settlement.settled
                                  ? 'linear-gradient(135deg, rgba(79, 172, 254, 0.1) 0%, rgba(0, 242, 254, 0.1) 100%)'
                                  : 'linear-gradient(135deg, rgba(250, 112, 154, 0.1) 0%, rgba(254, 225, 64, 0.1) 100%)',
                                border: `1px solid ${
                                  settlement.settled ? 'rgba(79, 172, 254, 0.3)' : 'rgba(250, 112, 154, 0.3)'
                                }`,
                                borderRadius: 2,
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                  <Avatar
                                    sx={{
                                      width: 32,
                                      height: 32,
                                      background: settlement.settled
                                        ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
                                        : 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                                    }}
                                  >
                                    {settlement.participant?.name.charAt(0).toUpperCase()}
                                  </Avatar>
                                  <Box>
                                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                                      {settlement.participant?.name}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#7f8c8d' }}>
                                      owes ₹{settlement.amount}
                                    </Typography>
                                  </Box>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Chip
                                    label={settlement.settled ? 'Settled' : 'Pending'}
                                    color={settlement.settled ? 'success' : 'warning'}
                                    size="small"
                                    icon={settlement.settled ? <CheckCircle /> : <Pending />}
                                  />
                                  <Button
                                    size="small"
                                    variant={settlement.settled ? 'outlined' : 'contained'}
                                    color={settlement.settled ? 'warning' : 'success'}
                                    onClick={() =>
                                      settlement.settled
                                        ? markSettlementAsPending(exp._id, settlement._id)
                                        : markSettlementAsSettled(exp._id, settlement._id)
                                    }
                                    sx={{ minWidth: 'auto', px: 2 }}
                                  >
                                    {settlement.settled ? 'Mark Pending' : 'Mark Settled'}
                                  </Button>
                                </Box>
                              </Box>
                            </Paper>
                          ))}
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grow>
              ))}
            </List>
          )}
        </Box>

        {/* Settlement Summary */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 600,
                color: '#2c3e50',
              }}
            >
              Settlement Summary
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                size="small"
                variant="outlined"
                onClick={markAllPendingAsSettled}
                disabled={pendingSettlements.length === 0}
                sx={{
                  borderColor: '#4facfe',
                  color: '#4facfe',
                  '&:hover': {
                    borderColor: '#3a9be8',
                    backgroundColor: 'rgba(79, 172, 254, 0.04)',
                  },
                  '&:disabled': {
                    borderColor: '#bdc3c7',
                    color: '#bdc3c7',
                  },
                }}
              >
                Mark All Pending as Settled
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={markAllSettledAsPending}
                disabled={settledSettlements.length === 0}
                sx={{
                  borderColor: '#fa709a',
                  color: '#fa709a',
                  '&:hover': {
                    borderColor: '#e666f0',
                    backgroundColor: 'rgba(250, 112, 154, 0.04)',
                  },
                  '&:disabled': {
                    borderColor: '#bdc3c7',
                    color: '#bdc3c7',
                  },
                }}
              >
                Mark All Settled as Pending
              </Button>
            </Box>
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Grow in={true} timeout={2200}>
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
                      background: 'linear-gradient(90deg, #fa709a 0%, #fee140 100%)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#2c3e50' }}>
                      Pending Settlements
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: '#fa709a', mb: 1 }}>
                      ₹{totalPending.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                      {pendingSettlements.length} settlements pending
                    </Typography>
                  </CardContent>
                </Card>
              </Grow>
            </Grid>

            <Grid item xs={12} md={6}>
              <Grow in={true} timeout={2400}>
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
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#2c3e50' }}>
                      Settled Amount
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: '#4facfe', mb: 1 }}>
                      ₹{totalSettled.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                      {settledSettlements.length} settlements completed
                    </Typography>
                  </CardContent>
                </Card>
              </Grow>
            </Grid>
          </Grid>
        </Box>

        {/* Add Expense Form */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              color: '#2c3e50',
              mb: 3,
            }}
          >
            Add New Expense
          </Typography>
          <Grow in={true} timeout={2600}>
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
              <CardContent sx={{ p: 4 }}>
                <ExpenseForm group={group} onAdded={handleExpenseAdded} />
              </CardContent>
            </Card>
          </Grow>
        </Box>

        {/* Send Reminders Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Grow in={true} timeout={2800}>
            <Button
              variant="contained"
              size="large"
              onClick={handleSendReminders}
              startIcon={<WhatsApp />}
              sx={{
                py: 2,
                px: 4,
                fontSize: '1.1rem',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #25d366 0%, #128c7e 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #128c7e 0%, #075e54 100%)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              Send WhatsApp Reminders 📱
            </Button>
          </Grow>
        </Box>

        {/* Floating Action Button */}
        <Fab
          color="primary"
          aria-label="add expense"
          onClick={() => document.getElementById('expense-form')?.scrollIntoView({ behavior: 'smooth' })}
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

export default GroupDetails; 