# JWT Authentication API

A complete JWT (JSON Web Token) authentication system built with Node.js, Express.js, and MongoDB. This project implements secure user registration, login, token refresh, and protected routes with proper password hashing and token management.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Authentication Flow](#authentication-flow)
- [Request/Response Examples](#requestresponse-examples)
- [Security Features](#security-features)
- [Error Handling](#error-handling)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- **User Registration** - Secure user registration with password hashing
- **User Login** - Authentication with email and password
- **JWT Token Generation** - Access and refresh token generation
- **Token Refresh** - Automatic token refresh mechanism
- **Protected Routes** - Middleware-protected endpoints
- **Password Security** - Bcrypt password hashing
- **MongoDB Integration** - User and token storage
- **Environment Configuration** - Secure environment variable management
- **Error Handling** - Comprehensive error responses
- **Token Expiration** - Configurable token expiration times

## 🛠 Tech Stack

- **Backend Framework**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **Password Hashing**: Bcrypt
- **Environment Management**: Dotenv
- **Development**: Nodemon for auto-restart

## 📁 Project Structure

```
jwt-authentication/
├── config/
│   └── db.js                 # MongoDB connection configuration
├── controllers/
│   └── auth.controller.js    # Authentication logic and handlers
├── middlewares/
│   └── auth.middleware.js    # JWT token verification middleware
├── models/
│   ├── user.model.js         # User schema and model
│   └── token.model.js        # Refresh token schema and model
├── routes/
│   └── auth.routes.js        # Authentication routes definition
├── utils/
│   └── token.util.js         # Token generation utilities
├── .env                      # Environment variables (not in repo)
├── .gitignore                # Git ignore file for credentials
├── app.js                    # Main application entry point
├── package.json              # Project dependencies and scripts
└── README.md                 # Project documentation
```

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** (v6 or higher)
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git** (for cloning the repository)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd jwt-authentication
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables** (see [Environment Variables](#environment-variables))

5. **Start the development server**
   ```bash
   npm run dev
   ```

## 🔧 Environment Variables

**⚠️ IMPORTANT: Never commit sensitive credentials to version control!**

This project includes a comprehensive `.gitignore` file that excludes all credential files, environment variables, and sensitive data from being committed to the repository.

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=3000

# JWT Secrets (Use strong, random strings in production)
ACCESS_TOKEN_SECRET=your_super_secret_access_token_key_here
REFRESH_TOKEN_SECRET=your_super_secret_refresh_token_key_here

# Token Expiration Times
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/jwt-authentication
# For MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/jwt-authentication
```

### Environment Variables Explanation

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port number | `3000` |
| `ACCESS_TOKEN_SECRET` | Secret key for access tokens | `your_access_secret_key` |
| `REFRESH_TOKEN_SECRET` | Secret key for refresh tokens | `your_refresh_secret_key` |
| `ACCESS_TOKEN_EXPIRES_IN` | Access token expiration time | `15m` |
| `REFRESH_TOKEN_EXPIRES_IN` | Refresh token expiration time | `7d` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/jwt-auth` |

## 🗄 Database Setup

### Local MongoDB Setup

1. **Install MongoDB** on your system
2. **Start MongoDB service**
   ```bash
   # Windows
   net start MongoDB
   
   # macOS (with Homebrew)
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

### MongoDB Atlas Setup (Cloud)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get connection string and update `MONGO_URI` in `.env`
4. Whitelist your IP address

## 🏃‍♂️ Running the Application

### Development Mode
```bash
npm run dev
```
This starts the server with nodemon for automatic restarts on file changes.

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:3000` (or your configured PORT).

## 🔗 API Endpoints

### Base URL
```
http://localhost:3000/api/auth
```

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register new user | No |
| POST | `/login` | User login | No |
| POST | `/refresh` | Refresh access token | No |
| GET | `/protected` | Protected route example | Yes |

## 🔐 Authentication Flow

```mermaid
sequenceDiagram
    participant Client
    participant Server
    participant Database

    Client->>Server: POST /register (username, email, password)
    Server->>Database: Save hashed password
    Database-->>Server: User created
    Server-->>Client: Success response

    Client->>Server: POST /login (email, password)
    Server->>Database: Verify credentials
    Database-->>Server: User data
    Server->>Server: Generate tokens
    Server->>Database: Store refresh token
    Server-->>Client: Access & Refresh tokens

    Client->>Server: GET /protected (with access token)
    Server->>Server: Verify access token
    Server-->>Client: Protected data

    Client->>Server: POST /refresh (refresh token)
    Server->>Database: Verify refresh token
    Server->>Server: Generate new tokens
    Server->>Database: Update refresh token
    Server-->>Client: New access & refresh tokens
```

## 📝 Request/Response Examples

### 1. User Registration

**Request:**
```bash
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

### 2. User Login

**Request:**
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Access Protected Route

**Request:**
```bash
GET /api/auth/protected
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "message": "Hello johndoe, this is a protected route!"
}
```

### 4. Refresh Token

**Request:**
```bash
POST /api/auth/refresh
Content-Type: application/json

{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## 🔒 Security Features

### Credential Protection
- **Git Ignore**: Comprehensive `.gitignore` file excludes all sensitive files:
  - Environment variables (`.env*` files)
  - JWT keys and certificates (`*.key`, `*.pem`, `*.crt`)
  - Credential files (`credentials.json`, `config/secrets.js`)
  - Token storage files and directories
  - Configuration files with sensitive data
- **No Hardcoded Secrets**: All sensitive data stored in environment variables
- **Separate Development/Production Configs**: Different credential files for each environment

### Password Security
- **Bcrypt Hashing**: Passwords are hashed using bcrypt with salt rounds of 10
- **No Plain Text Storage**: Passwords are never stored in plain text

### Token Security
- **JWT Implementation**: Secure JSON Web Tokens for authentication
- **Separate Secrets**: Different secrets for access and refresh tokens
- **Token Expiration**: Configurable expiration times
- **Refresh Token Rotation**: Old refresh tokens are invalidated when new ones are generated

### API Security
- **Input Validation**: Request body validation
- **Error Handling**: Secure error messages without sensitive information
- **CORS Ready**: Can be configured for cross-origin requests

## ⚠️ Error Handling

### Common Error Responses

| Status Code | Error Type | Description |
|-------------|------------|-------------|
| 400 | Bad Request | Invalid input data or user already exists |
| 401 | Unauthorized | Invalid credentials or missing token |
| 403 | Forbidden | Invalid or expired token |
| 500 | Internal Server Error | Server-side errors |

### Error Response Format
```json
{
  "error": "Error message description"
}
```

## 🧪 Testing

### Manual Testing with cURL

1. **Register a user:**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'
```

2. **Login:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

3. **Access protected route:**
```bash
curl -X GET http://localhost:3001/api/auth/protected \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Testing with Postman

1. Import the API endpoints into Postman
2. Set up environment variables for tokens
3. Test the complete authentication flow

## 🚀 Deployment

### Environment Setup for Production

1. **Set strong secrets:**
```bash
ACCESS_TOKEN_SECRET=$(openssl rand -base64 64)
REFRESH_TOKEN_SECRET=$(openssl rand -base64 64)
```

2. **Configure production database:**
```bash
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/production-db
```

### Deployment Platforms

#### Heroku
```bash
# Install Heroku CLI
heroku create your-app-name
heroku config:set ACCESS_TOKEN_SECRET=your_secret
heroku config:set REFRESH_TOKEN_SECRET=your_secret
heroku config:set MONGO_URI=your_mongo_uri
git push heroku main
```

#### Railway
```bash
# Connect your GitHub repository
# Set environment variables in Railway dashboard
# Deploy automatically on push
```

#### DigitalOcean App Platform
```bash
# Create app from GitHub repository
# Configure environment variables
# Deploy with automatic scaling
```

## 📚 Additional Resources

### JWT Resources
- [JWT.io](https://jwt.io/) - JWT debugger and documentation
- [RFC 7519](https://tools.ietf.org/html/rfc7519) - JWT specification

### Security Best Practices
- Use HTTPS in production
- Implement rate limiting
- Add request validation
- Use environment variables for secrets
- Regular security audits

### MongoDB Resources
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style
- Add comments for complex logic
- Update documentation for new features
- Test your changes thoroughly

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) section
2. Create a new issue with detailed description
3. Include error messages and steps to reproduce

## 🔄 Changelog

### Version 1.0.0
- Initial release
- User registration and login
- JWT token authentication
- Protected routes
- Token refresh mechanism
- MongoDB integration

---

**Made with ❤️ by MOHAMMAD ADNAN**

*Happy Coding! 🚀*