# 🚗 Smart Parking System

A comprehensive parking management system with real-time location tracking, interactive maps, and reward systems built with React, Node.js, and MongoDB.

## 🌟 Features

### 🗺️ Interactive Map Integration
- **OpenStreetMap with Leaflet.js**: Real-time parking location visualization
- **GPS Location Tracking**: Automatic user location detection
- **Smart Filtering**: Filter by parking type, payment method, and distance
- **Interactive Markers**: Click to view parking details and check-in
- **Distance Calculation**: Real-time distance from user to parking spots

### 🎯 Core Functionality
- **Real-time Parking Finder**: Find available parking spots near you
- **GPS-verified Check-ins**: Earn rewards for parking visits
- **Reward System**: Collect coins for verified parking visits
- **Multi-role Support**: User, Owner, Staff, and Admin roles
- **Request Management**: Submit and approve parking requests
- **Admin Dashboard**: Comprehensive management interface

### 🎨 Modern UI/UX
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark/Light Mode**: Beautiful theme system
- **Real-time Updates**: Live parking availability updates
- **Intuitive Navigation**: Easy-to-use interface
- **Toast Notifications**: User-friendly feedback system

## 🏗️ Architecture

### Frontend (React + TypeScript)
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Shadcn/ui** for UI components
- **React Router** for navigation
- **React Query** for data fetching
- **Leaflet.js** for map integration

### Backend (Node.js + Express)
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT Authentication** with bcrypt
- **Socket.IO** for real-time updates
- **Express Validator** for input validation
- **Multer** for file uploads
- **CORS** enabled for cross-origin requests

### Computer Vision Integration
- **YOLOv8** for vehicle detection
- **Real-time counting** of parking spaces
- **Automatic updates** to parking availability

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB 6+
- Python 3.8+ (for CV model)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd smart-parking-system
```

### 2. Backend Setup
```bash
cd api/backend
npm install
```

Create a `.env` file in `api/backend/`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smart-parking
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
```

Start the backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd client
npm install
```

Start the frontend:
```bash
npm run dev
```

### 4. Computer Vision Setup (Optional)
```bash
cd api/cv
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python cv-model.py
```

## 📱 Usage

### For Users
1. **Register/Login**: Create an account or sign in
2. **Find Parking**: Use the search page or interactive map
3. **Check-in**: Visit a parking location and check-in to earn coins
4. **Track Rewards**: View your coin balance and transaction history

### For Parking Owners
1. **Submit Requests**: Request to add new parking locations
2. **Manage Parkings**: Update vehicle counts and parking information
3. **View Analytics**: Monitor parking usage and earnings

### For Admins
1. **Approve Requests**: Review and approve parking requests
2. **Manage Users**: Oversee user accounts and roles
3. **System Monitoring**: View system statistics and analytics

## 🗺️ Map Features

### Interactive Parking Map
- **Real-time Location**: Shows your current GPS position
- **Parking Markers**: Color-coded markers for different parking types
  - 🟢 Green: Free parking available
  - 🔵 Blue: Paid parking available  
  - 🔴 Red: Parking full
- **Smart Popups**: Click markers for detailed information
- **Distance Filtering**: Filter parkings by distance from your location
- **Navigation**: Direct integration with Google Maps for directions

### Map Controls
- **Refresh**: Update parking data
- **Locate**: Center map on your current location
- **Filters**: Toggle filtering panel
- **Legend**: Understand marker colors and meanings

## 🔧 API Endpoints

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile

### Parking Management
- `GET /api/parkings` - Get all parkings
- `GET /api/parkings/nearby` - Get nearby parkings
- `POST /api/parkings` - Create new parking
- `PUT /api/parkings/:id/vehicle-count` - Update vehicle count

### Visit Tracking
- `POST /api/visits` - Record parking visit
- `GET /api/visits/user/me` - Get user visits
- `PUT /api/visits/:id/verify` - Verify visit

### Request Management
- `POST /api/requests` - Create request
- `GET /api/requests/user/me` - Get user requests
- `PUT /api/requests/:id/approve` - Approve request
- `PUT /api/requests/:id/deny` - Deny request

## 🎨 UI Components

### Built with Shadcn/ui
- **Cards**: Information display
- **Buttons**: Interactive elements
- **Forms**: User input
- **Tabs**: Organized content
- **Dropdowns**: Navigation menus
- **Toasts**: Notifications
- **Badges**: Status indicators

### Custom Components
- **ParkingMap**: Interactive map with Leaflet
- **ParkingCard**: Parking information display
- **AdminDashboard**: Admin management interface
- **AuthForms**: Login and registration

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **Input Validation**: Express-validator for data validation
- **CORS Protection**: Cross-origin request handling
- **Rate Limiting**: API request throttling
- **Helmet**: Security headers

## 📊 Database Schema

### User Model
```javascript
{
  name: String,
  email: String,
  phone: String,
  password: String,
  role: String, // user, owner, staff, admin
  wallet: {
    coins: Number,
    transactions: Array
  },
  location: {
    type: Point,
    coordinates: [Number, Number]
  }
}
```

### Parking Model
```javascript
{
  parkingId: String,
  name: String,
  description: String,
  location: {
    type: Point,
    coordinates: [Number, Number],
    address: Object
  },
  capacity: {
    car: Number,
    bus_truck: Number,
    bike: Number
  },
  currentCount: Object,
  hourlyRate: Object,
  isFull: Boolean
}
```

## 🚀 Deployment

### Frontend Deployment
```bash
cd client
npm run build
# Deploy dist/ folder to your hosting service
```

### Backend Deployment
```bash
cd api/backend
npm start
# Use PM2 or similar for production
```

### Environment Variables
Set production environment variables:
- `MONGODB_URI`: Production MongoDB connection
- `JWT_SECRET`: Strong secret key
- `NODE_ENV`: production
- `PORT`: Your server port

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation
- Review the code comments

## 🔮 Future Enhancements

- **Mobile App**: React Native version
- **Payment Integration**: Stripe/PayPal integration
- **Advanced Analytics**: Machine learning insights
- **IoT Integration**: Smart parking sensors
- **Multi-language**: Internationalization support
- **Real-time Chat**: Customer support system

---

**Built with ❤️ for smart urban mobility**
