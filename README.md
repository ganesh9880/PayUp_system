# PayUp - Group Expense Management App

A full-stack web application for managing group expenses, splitting bills, and sending WhatsApp reminders for payments.

## Features

- **User Authentication**: Register and login with email/WhatsApp
- **Group Management**: Create groups and add members
- **Expense Tracking**: Add expenses and split them among participants
- **Balance Calculation**: Automatic calculation of who owes what
- **WhatsApp Reminders**: Send payment reminders via WhatsApp
- **Real-time Updates**: See balances update as expenses are added

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Twilio** for WhatsApp integration

### Frontend
- **React** with Vite
- **Material-UI** for components
- **React Router** for navigation
- **Axios** for API calls

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (or local MongoDB)
- Twilio account (for WhatsApp features)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```env
   PORT=5000
   JWT_SECRET=your_jwt_secret_key_here
   MONGODB_URI=your_mongodb_connection_string

   # Twilio Configuration (for WhatsApp reminders)
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

   # UPI ID for payments
   UPI_ID=your_upi_id@bank
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Groups
- `GET /api/groups` - Get user's groups
- `POST /api/groups` - Create a new group
- `GET /api/groups/:groupId` - Get group details with balances
- `POST /api/groups/:groupId/members` - Add member to group
- `POST /api/groups/:groupId/expenses` - Add expense to group
- `POST /api/groups/:groupId/remind` - Send WhatsApp reminders

### Users
- `GET /api/users` - List all users (with search)

## Usage

1. **Register/Login**: Create an account or login with existing credentials
2. **Create Group**: Add a group name, description, and select members
3. **Add Expenses**: In a group, add expenses with description, amount, who paid, and participants
4. **View Balances**: See who owes money and who gets money back
5. **Send Reminders**: Send WhatsApp reminders to members who owe money

## Project Structure

```
PayUp/
├── backend/
│   ├── controllers/     # Route handlers
│   ├── middleware/      # Authentication middleware
│   ├── models/         # MongoDB schemas
│   ├── routes/         # API routes
│   └── server.js       # Express server
└── frontend/
    ├── src/
    │   ├── components/  # React components
    │   ├── pages/       # Page components
    │   ├── api/         # API configuration
    │   └── App.jsx      # Main app component
    └── package.json
```

## Environment Variables

Make sure to set up the following environment variables in your backend `.env` file:

- `JWT_SECRET`: Secret key for JWT token generation
- `MONGODB_URI`: MongoDB connection string
- `TWILIO_ACCOUNT_SID`: Your Twilio account SID
- `TWILIO_AUTH_TOKEN`: Your Twilio auth token
- `TWILIO_WHATSAPP_NUMBER`: Your Twilio WhatsApp number
- `UPI_ID`: Your UPI ID for receiving payments

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License. 