# 🚀 Frontend-Backend Integration Guide

## 📋 **Step-by-Step Integration Process**

### **Step 1: Backend Setup**

1. **Navigate to your backend directory:**
```bash
cd school-payment-backend
```

2. **Start your backend server:**
```bash
# If using Node.js/Express
npm start
# or
npm run dev

# If using Python/FastAPI
python main.py
# or
uvicorn main:app --reload
```

3. **Verify backend is running:**
- Check if your backend is accessible at `http://localhost:3000`
- Test the API endpoints using Postman or curl

### **Step 2: Frontend Configuration**

1. **Create environment file:**
```bash
# In your frontend directory
cp .env.example .env.local
```

2. **Update .env.local with your backend URL:**
```env
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_NAME=SchoolPay
VITE_ENABLE_DARK_MODE=true
VITE_ENABLE_ANIMATIONS=true
```

### **Step 3: Backend API Endpoints Required**

Your backend should have these endpoints:

#### **Authentication Endpoints:**
```
POST /auth/login
POST /auth/register
GET  /auth/profile
POST /auth/logout
POST /auth/refresh
```

#### **Transaction Endpoints:**
```
GET    /transactions
GET    /transactions/school/:schoolId
GET    /transactions/status/:customOrderId
POST   /transactions
PUT    /transactions/:id
DELETE /transactions/:id
```

#### **School Endpoints:**
```
GET  /schools
GET  /schools/:id
POST /schools
PUT  /schools/:id
```

#### **Dashboard Endpoints:**
```
GET /dashboard/stats
GET /dashboard/recent-transactions
```

### **Step 4: Expected Backend Response Format**

#### **Authentication Response:**
```json
{
  "success": true,
  "access_token": "jwt-token-here",
  "user": {
    "id": "1",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "schoolName": "ABC High School"
  }
}
```

#### **Transactions Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "collect_id": "COL123",
      "school_id": "SCH001",
      "gateway": "Razorpay",
      "order_amount": 1000,
      "transaction_amount": 1000,
      "status": "Success",
      "custom_order_id": "ORD123",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 100,
  "page": 1,
  "totalPages": 10
}
```

#### **Dashboard Stats Response:**
```json
{
  "success": true,
  "data": {
    "totalPayments": 50000,
    "pendingPayments": 5000,
    "overduePayments": 1000,
    "successRate": 95.5,
    "totalPaymentsChange": "+10%",
    "pendingPaymentsChange": "-5%",
    "overduePaymentsChange": "+2%",
    "successRateChange": "+3%"
  }
}
```

### **Step 5: CORS Configuration**

Make sure your backend has CORS enabled for the frontend:

#### **Node.js/Express:**
```javascript
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:3000', // Your frontend URL
  credentials: true
}));
```

#### **Python/FastAPI:**
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### **Step 6: Testing the Integration**

1. **Start both servers:**
```bash
# Terminal 1 - Backend
cd school-payment-backend
npm start

# Terminal 2 - Frontend
cd school-payment-frontend
npm run dev
```

2. **Test the integration:**
- Open `http://localhost:3000` (frontend)
- Try to sign up/sign in
- Check if data loads from backend
- Test all pages and features

### **Step 7: Troubleshooting**

#### **Common Issues:**

1. **CORS Error:**
   - Make sure backend CORS is configured
   - Check if frontend URL is correct in CORS settings

2. **404 Errors:**
   - Verify backend endpoints match frontend API calls
   - Check if backend server is running

3. **Authentication Issues:**
   - Verify JWT token format
   - Check if token is being sent in headers

4. **Data Format Issues:**
   - Ensure backend response format matches frontend expectations
   - Check if all required fields are present

### **Step 8: Production Deployment**

1. **Update environment variables for production:**
```env
VITE_API_BASE_URL=https://your-backend-domain.com
```

2. **Build frontend:**
```bash
npm run build
```

3. **Deploy both frontend and backend to your hosting platform**

## 🔧 **Development Tips**

- Use browser dev tools to monitor network requests
- Check console for any error messages
- Test with different user roles and permissions
- Verify all CRUD operations work correctly
- Test error handling and edge cases

## 📞 **Need Help?**

If you encounter any issues:
1. Check the browser console for errors
2. Verify backend logs
3. Test API endpoints directly with Postman
4. Ensure all environment variables are set correctly
