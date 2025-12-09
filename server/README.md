# SmokeFree India - Backend

## Setup Instructions

1. **Install Dependencies**
\`\`\`bash
npm install
\`\`\`

2. **Configure Environment Variables**
   - Copy `.env.example` to `.env`
   - Add your MongoDB Atlas connection string to `MONGODB_URI`
   - Generate a secure JWT secret for `JWT_SECRET`

3. **Seed the Database**
\`\`\`bash
npm run seed
\`\`\`

4. **Start the Server**
\`\`\`bash
npm run dev  # Development with auto-reload
npm start    # Production
\`\`\`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### States (Public)
- `GET /api/states` - Get all states
- `GET /api/states/:stateName` - Get specific state data

### Logs (Protected)
- `GET /api/logs` - Get user's logs
- `POST /api/logs` - Create new log
- `POST /api/logs/upload` - Upload CSV/Excel file
- `DELETE /api/logs/:id` - Delete log

## MongoDB Collections

1. **users** - User accounts
2. **states** - State-wise tobacco data
3. **logs** - User's daily smoking logs
