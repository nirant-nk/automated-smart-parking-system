# ParkSmart - Setup Guide

## Overview
This is a comprehensive smart parking system with a refactored frontend and robust backend. The application provides parking discovery, check-in functionality, request management, and a reward system for normal users.

## Features for Normal Users

### 🚗 Parking Discovery
- Interactive map showing nearby parking spots
- Real-time availability status
- Filter by parking type, payment method, and availability
- Distance calculation from user location

### 📍 Check-in System
- GPS-verified parking check-ins
- Earn coins for verified visits
- Distance validation for accurate check-ins

### 💰 Wallet & Rewards
- Coin balance tracking
- Transaction history with filtering
- Earn coins through:
  - Parking check-ins (10 coins)
  - Approved requests (50 coins)
  - Daily bonuses

### 📝 Request Management
- Submit new parking location requests
- Track request status (pending/approved/denied)
- View admin feedback and notes
- Earn coins for approved requests

### 🗺️ Interactive Map
- Real-time parking location display
- Color-coded markers (green=available, red=full)
- User location tracking
- Click markers for detailed information

## Setup Instructions

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd api/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .sample.env .env
   ```

4. Configure environment variables in `.env`:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/smart-parking
   JWT_SECRET=your-super-secret-jwt-key
   NODE_ENV=development
   ```

5. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   echo "VITE_API_BASE_URL=http://localhost:5000/api" > .env
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```

## Usage

### For Normal Users

1. **Registration/Login**
   - Visit the application and create an account
   - Provide name, email, phone, and password
   - Login with your credentials

2. **Find Parking**
   - Use the interactive map on the home page
   - Search for specific locations
   - Filter by parking type and payment method
   - View real-time availability

3. **Check-in at Parking**
   - Navigate to a parking location
   - Click "Check In & Earn Coins" button
   - Ensure location access is enabled
   - Earn 10 coins for verified check-ins

4. **Manage Requests**
   - Submit new parking location requests
   - Provide detailed information about the location
   - Track request status and admin feedback
   - Earn 50 coins for approved requests

5. **Wallet Management**
   - View your coin balance
   - Check transaction history
   - Filter transactions by type
   - See how to earn more coins

## Technical Architecture

### Frontend (React + TypeScript)
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **React Query** for data fetching
- **React Router** for navigation
- **Leaflet.js** for map integration
- **React Hot Toast** for notifications

### Backend (Node.js + Express)
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT Authentication**
- **Socket.IO** for real-time updates
- **Express Validator** for validation
- **Multer** for file uploads

### Key Components

#### Navigation
- Responsive navigation bar
- User profile dropdown
- Wallet balance display
- Mobile-friendly menu

#### Map Integration
- Interactive parking map
- Real-time location tracking
- Custom parking markers
- Distance calculation

#### Authentication
- JWT-based authentication
- Protected routes
- User session management
- Automatic token refresh

#### Data Management
- React Query for server state
- Optimistic updates
- Error handling
- Loading states

## API Endpoints

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile

### Parking
- `GET /api/parkings` - Get all parkings
- `GET /api/parkings/:id` - Get parking details
- `GET /api/parkings/nearby` - Get nearby parkings

### Visits
- `POST /api/visits` - Create parking visit
- `GET /api/visits/user/me` - Get user visits

### Requests
- `POST /api/requests` - Create request
- `GET /api/requests/user/me` - Get user requests

## Development Notes

### Frontend Improvements Made
1. **Consistent Layout System**
   - Created reusable Layout component
   - Added responsive navigation
   - Implemented proper routing

2. **Enhanced User Experience**
   - Added loading states and error handling
   - Implemented toast notifications
   - Created responsive design

3. **Map Integration**
   - Interactive parking map with Leaflet
   - Real-time location tracking
   - Custom markers and popups

4. **Data Management**
   - React Query for efficient data fetching
   - Optimistic updates for better UX
   - Proper error boundaries

5. **Authentication Flow**
   - Protected routes
   - Automatic redirects
   - Session management

### Backend Features
- Comprehensive API endpoints
- JWT authentication
- Real-time updates with Socket.IO
- Input validation and error handling
- MongoDB integration with Mongoose

## Testing the Application

1. **Start both servers** (backend and frontend)
2. **Register a new account**
3. **Explore the parking map**
4. **Submit a parking request**
5. **Check your wallet balance**
6. **Test the check-in functionality**

## Troubleshooting

### Common Issues
1. **CORS errors**: Ensure backend CORS is configured for frontend URL
2. **Map not loading**: Check if Leaflet CSS is properly imported
3. **Authentication issues**: Verify JWT token is being sent correctly
4. **Location access**: Ensure browser location permissions are granted

### Development Tips
- Use browser dev tools to monitor API calls
- Check network tab for request/response details
- Enable location access for full functionality
- Test on different screen sizes for responsiveness

## Future Enhancements
- Mobile app development
- Payment integration
- Advanced analytics
- Push notifications
- Social features
- Multi-language support
