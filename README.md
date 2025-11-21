# 🎉 Wishie - Never Forget a Birthday Again

A MERN stack PWA for managing contacts, events (birthdays/anniversaries), and sending wishes via WhatsApp.

## 🚀 Features

- ✅ User authentication with JWT
- ✅ Contact management with phone numbers
- ✅ Event tracking (birthdays, anniversaries, pet birthdays)
- ✅ Smart date calculations (handles leap years)
- ✅ "Today's events" dashboard
- ✅ Upcoming events (next 30 days)
- 🔜 Wish templates and generation
- 🔜 WhatsApp integration
- 🔜 Offline-first PWA with sync

## 🛠️ Tech Stack

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs for password hashing
- express-validator for input sanitization

**Frontend (Coming Soon):**
- React + Vite
- PWA with service workers
- LocalForage for offline storage
- Axios for API calls

## 📦 Installation

### Backend Setup


cd backend
npm install

text

Create `.env` file:
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/wishie
JWT_ACCESS_SECRET=your_secret_minimum_32_chars
JWT_REFRESH_SECRET=your_refresh_secret_minimum_32_chars
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
CORS_ORIGIN=http://localhost:5173


Start development server:
npm run dev


## 🧪 API Endpoints

### Auth
- POST `/api/auth/register` - Register user
- POST `/api/auth/login` - Login user
- POST `/api/auth/refresh` - Refresh access token
- POST `/api/auth/logout` - Logout user
- GET `/api/auth/me` - Get current user

### Contacts
- GET `/api/contacts` - Get all contacts
- GET `/api/contacts/:id` - Get single contact
- POST `/api/contacts` - Create contact
- PUT `/api/contacts/:id` - Update contact
- DELETE `/api/contacts/:id` - Delete contact

### Events
- GET `/api/events` - Get all events
- GET `/api/events/today` - Get today's events
- GET `/api/events/upcoming` - Get upcoming events (30 days)
- POST `/api/events` - Create event
- PUT `/api/events/:id` - Update event
- DELETE `/api/events/:id` - Delete event

## 📝 Current Progress

- [x] Phase 1-2: Authentication & User Management
- [x] Phase 3: Contacts Module
- [x] Phase 4: Events Module with Smart Date Handling
- [ ] Phase 5: Templates & Wish Generation
- [ ] Phase 6: WhatsApp Integration
- [ ] Phase 7: Cron Jobs & Notifications
- [ ] Phase 8-10: Frontend (React PWA)
- [ ] Phase 11: Deployment

## 👨‍💻 Author

Built by Anurag 

## 📄 License

MIT