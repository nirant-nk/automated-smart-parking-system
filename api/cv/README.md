# Advanced Smart Parking System - CV Model Backend

A high-performance computer vision backend for real-time vehicle counting in parking lots using YOLOv8 and advanced tracking algorithms.

## Features

- **Real-time Vehicle Detection**: Uses YOLOv8 for accurate vehicle detection (cars, buses/trucks, bikes)
- **Advanced Tracking**: Improved centroid tracker with better object persistence
- **Socket.IO Integration**: Real-time communication with the core Node.js backend
- **Manual Adjustments**: Staff can manually correct counts when needed
- **Multi-Parking Support**: Handle multiple parking lots simultaneously
- **WebSocket API**: Real-time updates for frontend applications
- **RESTful API**: Complete management interface
- **Automatic Reconnection**: Robust connection handling with retry logic

## Tech Stack

- **Framework**: FastAPI (Python)
- **Computer Vision**: YOLOv8 (Ultralytics)
- **Real-time Communication**: Socket.IO
- **Video Processing**: OpenCV
- **Data Validation**: Pydantic
- **Logging**: Python logging

## Prerequisites

- Python 3.8+
- CUDA-compatible GPU (optional, for faster inference)
- Camera or video stream access

## Installation

### Prerequisites
- Python 3.8+ (Python 3.13+ may have compatibility issues)
- pip (latest version)
- Virtual environment (recommended)

### Method 1: Standard Installation (Recommended)

1. **Clone the repository** (if not already done):
   ```bash
   cd api/cv
   ```

2. **Create virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  
   # On Windows: 
   venv/Scripts/activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

### Method 2: Automated Installation (For Python 3.13+)

If you encounter installation issues (especially with Python 3.13+), use the automated installer:

```bash
python install_dependencies.py
```

This script will:
- Check your Python version
- Install build tools first
- Handle compatibility issues
- Provide alternative installation methods
- Verify the installation

### Method 3: Manual Installation (Fallback)

If both methods fail, try installing packages individually:

```bash
# Install build tools first
pip install --upgrade pip setuptools wheel

# Install core dependencies
pip install fastapi uvicorn[standard] pydantic python-socketio python-multipart

# Install CV dependencies
pip install opencv-python-headless ultralytics numpy

# Install utilities
pip install python-dotenv requests aiofiles

# Install dev dependencies (optional)
pip install pytest pytest-asyncio
```

### Post-Installation

4. **Download YOLO model** (automatically done on first run):
   ```bash
   # The model will be downloaded automatically when the service starts
   # or you can manually download it:
   python -c "from ultralytics import YOLO; YOLO('yolov8n.pt')"
   ```

5. **Setup environment**:
   ```bash
   cp .sample.env .env
   # Edit .env with your configuration
   ```

### Troubleshooting Installation Issues

#### Python 3.13+ Issues
If you're using Python 3.13+ and encounter build errors:

1. **Use the automated installer**:
   ```bash
   python install_dependencies.py
   ```

2. **Try alternative requirements**:
   ```bash
   pip install -r requirements_alt.txt
   ```

3. **Use conda instead of pip**:
   ```bash
   conda install -c conda-forge opencv numpy
   pip install fastapi uvicorn ultralytics
   ```

#### Common Issues

1. **setuptools.build_meta error**:
   ```bash
   pip install --upgrade setuptools wheel
   pip install -r requirements.txt
   ```

2. **OpenCV installation fails**:
   ```bash
   pip install opencv-python-headless
   ```

3. **NumPy compilation issues**:
   ```bash
   pip install numpy --only-binary=all
   ```

4. **Permission errors**:
   ```bash
   pip install --user -r requirements.txt
   ```

## Configuration

Create a `.env` file based on `.sample.env`:

```env
# Core Backend Connection
NODE_BACKEND_URL=http://localhost:5000
CV_MODEL_ID=cv_model_001

# YOLO Model Configuration
YOLO_MODEL_PATH=yolov8n.pt
YOLO_CONFIDENCE=0.4
YOLO_IMAGE_SIZE=640

# Tracking Configuration
MAX_DISAPPEARED=30
MAX_DISTANCE=50

# Processing Configuration
PROCESS_INTERVAL=1.0
FRAME_WIDTH=640
FRAME_HEIGHT=360

# Server Configuration
HOST=0.0.0.0
PORT=5001

# Logging
LOG_LEVEL=INFO
```

## Usage

### Starting the Service

```bash
# Development mode
python cv-model.py

# Or using uvicorn directly
uvicorn cv-model:app --host 0.0.0.0 --port 5001 --reload
```

### API Endpoints

#### Health Check
```bash
GET /health
```

#### Initialize Parking Processor
```bash
POST /init
Content-Type: application/json

{
  "parking_id": "parking_001",
  "capacities": {
    "car": 50,
    "bus_truck": 10,
    "bike": 100
  },
  "camera_source": "rtsp://camera_url",
  "model_id": "cv_model_001"
}
```

#### Get Parking Status
```bash
GET /status/{parking_id}
```

#### Manual Count Adjustment
```bash
PATCH /adjust/{parking_id}
Content-Type: application/json

{
  "adjustments": {
    "car": 25,
    "bus_truck": 3,
    "bike": 45
  }
}
```

#### Stop Parking Processor
```bash
POST /stop/{parking_id}
```

#### List Active Processors
```bash
GET /list
```

#### Get Configuration
```bash
GET /config
```

### WebSocket Connection

Connect to real-time updates:
```javascript
const ws = new WebSocket('ws://localhost:5001/ws/parking_001');

ws.onmessage = function(event) {
  const data = JSON.parse(event.data);
  console.log('Parking status:', data);
};
```

## Integration with Core Backend

The CV model automatically connects to the core Node.js backend and sends real-time updates via Socket.IO:

### Socket.IO Events

#### Outgoing Events (CV → Core Backend)
- `cv_model_connect`: Register CV model with core backend
- `parking_count_update`: Send vehicle count updates

#### Incoming Events (Core Backend → CV)
- `manual_count_update`: Receive manual count adjustments from staff

### Data Format

```json
{
  "parking_id": "parking_001",
  "counts": {
    "car": 25,
    "bus_truck": 3,
    "bike": 45
  },
  "capacity": {
    "car": 50,
    "bus_truck": 10,
    "bike": 100
  },
  "available": {
    "car": 25,
    "bus_truck": 7,
    "bike": 55
  },
  "is_full": false,
  "last_updated": "2024-01-15T10:30:00Z",
  "model_id": "cv_model_001"
}
```

## Vehicle Detection

### Supported Vehicle Types
- **Car**: Sedans, SUVs, hatchbacks
- **Bus/Truck**: Buses, trucks, large commercial vehicles
- **Bike**: Motorcycles, bicycles

### Detection Accuracy
- **Confidence Threshold**: 0.4 (configurable)
- **Model**: YOLOv8n (nano) - fast and efficient
- **Processing**: Real-time with 1-second intervals

## Performance Optimization

### GPU Acceleration
For better performance, ensure CUDA is available:
```bash
# Check CUDA availability
python -c "import torch; print(torch.cuda.is_available())"
```

### Configuration Tuning
- **YOLO_CONFIDENCE**: Lower for more detections, higher for accuracy
- **MAX_DISAPPEARED**: How long to track objects after they disappear
- **MAX_DISTANCE**: Maximum distance for object tracking
- **PROCESS_INTERVAL**: Update frequency (seconds)

## Error Handling

The service includes comprehensive error handling:
- **Connection Retries**: Automatic reconnection to core backend
- **Video Source Failures**: Graceful handling of camera disconnections
- **Model Loading**: Fallback handling for YOLO model issues
- **Memory Management**: Proper cleanup of resources

## Monitoring

### Logs
The service provides detailed logging:
```bash
# View logs
tail -f logs/cv-model.log
```

### Health Monitoring
```bash
# Check service health
curl http://localhost:5001/health
```

## Development

### Running Tests
```bash
pytest tests/
```

### Code Style
```bash
# Install pre-commit hooks
pre-commit install
```

## Troubleshooting

### Common Issues

1. **YOLO Model Not Loading**
   ```bash
   # Check if ultralytics is installed
   pip install ultralytics
   
   # Download model manually
   python -c "from ultralytics import YOLO; YOLO('yolov8n.pt')"
   ```

2. **Socket.IO Connection Failed**
   - Verify core backend is running on correct URL
   - Check firewall settings
   - Ensure CORS is properly configured

3. **Camera Access Issues**
   - Verify camera URL/RTSP stream is accessible
   - Check network connectivity
   - Ensure proper permissions

4. **High CPU Usage**
   - Reduce YOLO_IMAGE_SIZE
   - Increase PROCESS_INTERVAL
   - Use GPU acceleration if available

## Deployment

### Docker Deployment
```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 5001

CMD ["python", "cv-model.py"]
```

### Production Considerations
- Use environment variables for configuration
- Implement proper logging and monitoring
- Set up health checks and auto-restart
- Configure reverse proxy (nginx)
- Use process manager (systemd, supervisor)

## License

This project is part of the Advanced Smart Parking System.

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review logs for error details
3. Verify configuration settings
4. Test with sample video files first
