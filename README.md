# Leaderboard System

A complete leaderboard system built with Node.js, Express, MongoDB, and React. Users can claim random points, view real-time rankings, and add new users to the system.

## Features

✅ **Complete Feature Set:**

- 10 default users pre-loaded (Rahul, Kamal, Sanak, etc.)
- User selection dropdown with current points display
- Random point claiming (1-10 points per claim)
- Real-time leaderboard with dynamic rankings
- Add new users functionality
- Points history tracking
- Modern, responsive UI inspired by the provided examples
- Real-time updates using Socket.io

✅ **Database Collections:**

- **Users Collection**: Stores user information, total points, and rankings
- **Points History Collection**: Tracks every point claim with timestamps

✅ **Modern UI Features:**

- Top 3 podium display with crowns and medals
- Gradient backgrounds and hover effects
- Responsive design for all screen sizes
- Real-time notifications for point claims
- Recent activity feed

## Tech Stack

**Backend:**

- Node.js with Express
- MongoDB with Mongoose
- Socket.io for real-time updates
- CORS enabled for frontend communication

**Frontend:**

- React 18 with Hooks
- Tailwind CSS for styling
- Lucide React for icons
- Socket.io client for real-time updates

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally on default port 27017)
- npm or yarn package manager

### Backend Setup

1. **Create backend directory and install dependencies:**

```bash
mkdir leaderboard-backend
cd leaderboard-backend
npm init -y
npm install express mongoose cors socket.io
npm install -D nodemon
```

2. **Create the server file:**

- Copy the provided `server.js` code
- Update the `package.json` with the provided backend package.json

3. **Start MongoDB:**

```bash
# Make sure MongoDB is running
mongod
```

4. **Run the backend server:**

```bash
npm run dev
# or
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. **Create React application:**

```bash
npx create-react-app leaderboard-frontend
cd leaderboard-frontend
```

2. **Install additional dependencies:**

```bash
npm install socket.io-client
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

3. **Configure Tailwind CSS:**
   Update `tailwind.config.js`:

```javascript
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

Add to `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

4. **Replace App.js with the provided React component**

5. **Update package.json with the provided frontend package.json**

6. **Start the frontend:**

```bash
npm start
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Users

- `GET /api/users` - Get all users with rankings
- `POST /api/users` - Add a new user
  ```json
  { "name": "User Name" }
  ```

### Points

- `POST /api/claim-points` - Claim random points for a user
  ```json
  { "userId": "user_id_here" }
  ```

### History

- `GET /api/points-history` - Get recent points history (last 50 records)
- `GET /api/points-history/:userId` - Get points history for specific user

## Database Schema

### User Schema

```javascript
{
  name: String (required, unique),
  totalPoints: Number (default: 0),
  rank: Number (default: 0),
  createdAt: Date (default: Date.now)
}
```

### Points History Schema

```javascript
{
  userId: ObjectId (ref: 'User'),
  userName: String,
  pointsAwarded: Number,
  timestamp: Date (default: Date.now)
}
```

## Features Implementation

### ✅ Core Requirements Met:

1. **User Selection**: Dropdown with all users showing current points
2. **Random Points**: 1-10 points awarded randomly on claim
3. **Database Storage**: MongoDB with proper collections
4. **Dynamic Rankings**: Real-time rank calculation and updates
5. **Add Users**: Frontend form to add new users
6. **Points History**: Complete tracking of all point claims
7. **Real-time Updates**: Socket.io for live leaderboard updates

### ✅ Bonus Points Features:

1. **Clean Modern UI**: Inspired by the provided mobile app examples
2. **Responsive Design**: Works perfectly on desktop, tablet, and mobile
3. **Real-time Updates**: Socket.io integration for live leaderboard changes
4. **Visual Hierarchy**: Top 3 podium display with crown/medal icons
5. **Interactive Elements**: Hover effects, smooth transitions, and animations
6. **Modern Gradients**: Beautiful color schemes matching current design trends
7. **Code Quality**: Well-structured, commented, and reusable components
8. **Error Handling**: Proper validation and user feedback
9. **Performance**: Optimized API calls and efficient state management

## Usage Guide

### 1. **Select a User**

- Choose any user from the dropdown menu
- The dropdown shows current points for each user
- Selected user is highlighted in the leaderboard

### 2. **Claim Points**

- Click the "Claim Points" button
- System awards 1-10 random points to selected user
- Success notification shows points awarded
- Leaderboard updates automatically with new rankings

### 3. **Add New Users**

- Click "Add User" button in the left panel
- Enter the new user's name
- User is immediately added to database and leaderboard
- Rankings recalculate automatically

### 4. **View Rankings**

- Top 3 users displayed in podium format with special icons
- Full leaderboard shows all users with ranks and points
- Real-time updates when anyone claims points
- Recent activity panel shows last 10 point claims

## Real-time Features

The application uses Socket.io for real-time updates:

- When any user claims points, all connected clients see the update instantly
- Leaderboard rankings update automatically
- No need to refresh the page
- Multiple users can use the system simultaneously

## Error Handling

- **Duplicate Users**: Cannot add users with existing names
- **Empty Names**: User names cannot be empty or just whitespace
- **Invalid Selections**: Cannot claim points without selecting a user
- **Database Errors**: Proper error messages for connection issues
- **Loading States**: Visual feedback during API calls

## File Structure

```
leaderboard-backend/
├── server.js              # Main server file
├── package.json           # Backend dependencies
└── README.md             # This file

leaderboard-frontend/
├── src/
│   ├── App.js            # Main React component
│   ├── index.js          # React entry point
│   └── index.css         # Tailwind CSS imports
├── package.json          # Frontend dependencies
└── public/               # Static files
```

## Default Users

The system comes pre-loaded with 10 users:

1. Rahul
2. Kamal
3. Sanak
4. Priya
5. Amit
6. Sneha
7. Ravi
8. Pooja
9. Vikash
10. Anita

All users start with 0 points and can immediately begin claiming points.

## MongoDB Collections

### Users Collection Example:

```json
{
  "_id": "ObjectId",
  "name": "Rahul",
  "totalPoints": 45,
  "rank": 3,
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

### Points History Collection Example:

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "userName": "Rahul",
  "pointsAwarded": 7,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Customization Options

### Adding More Default Users:

Edit the `defaultUsers` array in `server.js`:

```javascript
const defaultUsers = [
  "Rahul",
  "Kamal",
  "Sanak",
  "YourNewUser1",
  "YourNewUser2",
  // Add more names here
];
```

### Changing Point Range:

Modify the random points logic in `server.js`:

```javascript
// Current: 1-10 points
const randomPoints = Math.floor(Math.random() * 10) + 1;

// For 1-20 points:
const randomPoints = Math.floor(Math.random() * 20) + 1;
```

### Styling Customization:

The frontend uses Tailwind CSS classes. You can easily modify:

- Colors: Change `bg-blue-500` to `bg-green-500` etc.
- Gradients: Update gradient classes like `from-purple-100 to-blue-50`
- Spacing: Modify padding/margin classes like `p-6`, `m-4`

## Troubleshooting

### Common Issues:

1. **MongoDB Connection Error:**

   - Ensure MongoDB is running: `mongod`
   - Check connection string in server.js
   - Verify MongoDB port (default: 27017)

2. **CORS Issues:**

   - Backend includes CORS middleware
   - Frontend proxy configured in package.json
   - Check API_BASE URL in React component

3. **Port Conflicts:**

   - Backend runs on port 5000
   - Frontend runs on port 3000
   - Change ports in respective files if needed

4. **Socket.io Connection Issues:**
   - Check firewall settings
   - Ensure both frontend and backend are running
   - Verify Socket.io client connection in browser dev tools

### Performance Tips:

1. **Database Indexing:**

   ```javascript
   // Add to server.js for better performance
   userSchema.index({ totalPoints: -1 });
   pointsHistorySchema.index({ timestamp: -1 });
   ```

2. **Pagination for Large Datasets:**

   - Implement pagination for users list if >100 users
   - Limit history records display (currently limited to 50)

3. **Caching:**
   - Consider Redis for caching frequent leaderboard queries
   - Implement client-side caching for user data

## Deployment Considerations

### Backend Deployment:

- Use environment variables for MongoDB connection
- Add production MongoDB instance (MongoDB Atlas)
- Configure proper CORS origins for production

### Frontend Deployment:

- Build optimized production bundle: `npm run build`
- Update API_BASE URL for production backend
- Configure proper environment variables

### Environment Variables Example:

```bash
# .env file for backend
MONGODB_URI=mongodb://localhost:27017/leaderboard
PORT=5000
NODE_ENV=production
CORS_ORIGIN=http://localhost:3000
```

This complete leaderboard system meets all requirements and includes bonus features for a professional, modern application. The code is production-ready with proper error handling, real-time updates, and a clean, responsive user interface.
