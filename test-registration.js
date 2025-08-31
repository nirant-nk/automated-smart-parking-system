const mongoose = require('mongoose');

// Test user data
const testUser = {
  name: "Test User",
  email: "test@example.com",
  phone: "1234567890",
  password: "password123"
};

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/smart-parking', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Define a simple user schema for testing
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  password: String,
  role: {
    type: String,
    default: 'user'
  },
  wallet: {
    coins: {
      type: Number,
      default: 0
    },
    transactions: []
  },
  ownedParkings: [],
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: false
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Add sparse geospatial index
userSchema.index({ location: '2dsphere' }, { sparse: true });

// Pre-save middleware to handle location
userSchema.pre('save', function(next) {
  // Handle location field - if coordinates are not provided, remove the location field
  if (this.location && (!this.location.coordinates || this.location.coordinates.length === 0)) {
    this.location = undefined;
  }
  next();
});

const User = mongoose.model('User', userSchema);

async function testRegistration() {
  try {
    console.log('Testing user registration...');
    
    // Test creating a user without location
    const user = await User.create(testUser);
    console.log('✅ User created successfully:', user._id);
    
    // Test creating a user with location
    const userWithLocation = await User.create({
      ...testUser,
      email: 'test2@example.com',
      phone: '1234567891',
      location: {
        type: 'Point',
        coordinates: [longitude, latitude]
      }
    });
    console.log('✅ User with location created successfully:', userWithLocation._id);
    
    console.log('🎉 All tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    mongoose.connection.close();
  }
}

testRegistration();
