# Advanced Smart Parking System - Core Backend

A robust Node.js/Express backend for the Advanced Smart Parking System with real-time vehicle counting, user management, and parking analytics.

## Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (Admin, Owner, Staff, User)
- Secure password hashing with bcrypt
- Session management with cookies

### 🏢 Parking Management
- Real-time vehicle count updates via Socket.IO
- Support for multiple vehicle types (Car, Bus/Truck, Bike)
- Parking capacity management
- Location-based parking search
- Parking approval system

### 👥 User Management
- User registration and authentication
- Wallet system with in-app coins
- Transaction history
- Profile management
- Location tracking

### 📝 Request System
- Parking addition requests
- No-parking zone requests
- Admin approval system
- Coin rewards for approved requests

### 📊 Analytics & Statistics
- Parking visit tracking
- Revenue analytics
- Occupancy statistics
- User activity metrics

### 🔌 Real-time Communication
- Socket.IO integration
- CV model backend communication
- Real-time parking count updates
- Live notifications

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT + bcrypt
- **Real-time**: Socket.IO
- **Validation**: express-validator
- **Security**: Helmet, CORS, Rate Limiting
- **Logging**: Morgan

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd api/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/asps_db
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   FRONTEND_URL=http://localhost:3000
   CV_MODEL_URL=http://localhost:5001
   ```

4. **Start MongoDB**
   ```bash
   # Start MongoDB service
   mongod
   ```

5. **Run the application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `POST /api/users/logout` - User logout

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/wallet` - Get user wallet
- `GET /api/users/wallet/transactions` - Get wallet transactions

### Parkings
- `GET /api/parkings` - Get all parkings
- `GET /api/parkings/nearby` - Get nearby parkings
- `GET /api/parkings/available` - Get available parkings
- `POST /api/parkings` - Create parking (Owner/Admin)
- `PUT /api/parkings/:parkingId` - Update parking
- `PUT /api/parkings/:parkingId/vehicle-count` - Update vehicle count

### Requests
- `POST /api/requests` - Create request
- `GET /api/requests/user/me` - Get user requests
- `PUT /api/requests/:requestId/approve` - Approve request (Admin)
- `PUT /api/requests/:requestId/deny` - Deny request (Admin)

### Visits
- `POST /api/visits` - Record parking visit
- `GET /api/visits/user/me` - Get user visits
- `GET /api/visits/statistics` - Get visit statistics

### Admin Routes
- `GET /api/users` - Get all users (Admin)
- `PUT /api/users/:userId/role` - Update user role (Admin)
- `GET /api/requests` - Get all requests (Admin)
- `GET /api/requests/pending` - Get pending requests (Admin)

## Socket.IO Events

### Client Events
- `authenticate` - Authenticate client
- `join_parking_room` - Join parking room for real-time updates
- `leave_parking_room` - Leave parking room

### Server Events
- `parking_count_updated` - Real-time parking count updates
- `authenticated` - Authentication confirmation
- `joined_parking_room` - Room join confirmation

### CV Model Events
- `cv_model_connect` - CV model connection
- `parking_count_update` - Receive count updates from CV model
- `staff_count_update` - Staff manual count updates

## Database Models

### User
- Basic info (name, email, phone)
- Role-based access
- Wallet with coins and transactions
- Location tracking
- Owned parkings and staff assignments

### Parking
- Location and capacity
- Real-time vehicle counts
- Owner and staff management
- Approval status
- Statistics and analytics

### Request
- Parking/no-parking requests
- User submissions
- Admin approval workflow
- Coin rewards

### Visit
- Parking visit tracking
- Distance calculation
- Coin earnings
- Verification system

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/asps_db` |
| `JWT_SECRET` | JWT secret key | Required |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |
| `CV_MODEL_URL` | CV model backend URL | `http://localhost:5001` |

## Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: API request throttling
- **Input Validation**: Request data validation
- **Password Hashing**: bcrypt encryption
- **JWT**: Secure token-based authentication

## Error Handling

- Centralized error handling middleware
- Custom error classes
- Validation error responses
- Graceful error recovery

## Logging

- Request logging with Morgan
- Error logging
- Database connection logging
- Socket.IO event logging

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## Deployment

1. **Production Environment**
   ```bash
   NODE_ENV=production
   npm start
   ```

2. **Docker Deployment**
   ```bash
   docker build -t asps-backend .
   docker run -p 5000:5000 asps-backend
   ```

3. **Environment Variables for Production**
   - Set `NODE_ENV=production`
   - Use strong `JWT_SECRET`
   - Configure production MongoDB URI
   - Set appropriate CORS origins

## API Documentation

### Request/Response Format

All API responses follow this format:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Error Response Format
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

### Authentication

Include JWT token in request headers:
```
Authorization: Bearer <token>
```

### Pagination

Use query parameters for paginated endpoints:
```
?page=1&limit=20
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team.
