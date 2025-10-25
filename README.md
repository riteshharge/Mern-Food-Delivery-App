# MERN Eats (Local MongoDB)
A full-stack food-delivery demo inspired by typical delivery UIs. Works offline with local MongoDB.

## Tech
- MongoDB (local) + Mongoose
- Node.js + Express
- React + Vite
- JWT Auth, Cart, Orders, Admin Seed
- Simple unit/integration tests (Jest + Supertest on server)

## Quick Start

### 1) Prereqs
- Install Node.js LTS
- Install & run MongoDB locally (mongod service) on default port 27017

### 2) Backend
```bash
cd server
cp .env.example .env  # optional edit
npm install
npm run seed          # loads sample foods & an admin user
npm run dev           # starts http://localhost:5000
```

### 3) Frontend
```bash
cd ../client
cp .env.example .env  # optional edit
npm install
npm run dev           # starts http://localhost:5173
```

### 4) Login
- Admin (for demo): email: admin@eats.local / password: admin123
- Or create a user via Signup

### 5) Tests (server)
```bash
cd server
npm test
```

## Env Files
- `server/.env`
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/mern_eats
JWT_SECRET=supersecret_local_key
NODE_ENV=development
```

- `client/.env`
```
VITE_API_URL=http://localhost:5000/api
```

## Notes
- This is intentionally lightweight but production-ready structure. Replace UI copy, add images, and extend as needed.
