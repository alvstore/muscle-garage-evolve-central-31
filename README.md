
# Muscle Garage CRM System

A comprehensive gym management system for Muscle Garage with MongoDB backend.

## Features

- Member Management
- Trainer Management
- Class Scheduling
- Payments & Invoicing
- Attendance Tracking
- Progress Monitoring
- Communication Tools

## Tech Stack

- Frontend: React, Tailwind CSS, Shadcn UI
- Backend: Node.js, Express, MongoDB with Mongoose ODM
- Authentication: JWT

## Setup Instructions

### Local Development

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd muscle-garage-crm
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory with the following variables:

   ```
   MONGO_URI=mongodb://localhost:27017/musclegarage
   NODE_ENV=development
   PORT=5000
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=30d
   JWT_COOKIE_EXPIRE=30
   ```

4. **Start MongoDB**

   Make sure MongoDB is installed and running on your local machine.

   ```bash
   mongod
   ```

5. **Run the application**

   ```bash
   # Run frontend and backend concurrently
   npm run dev
   
   # Or run separately
   npm run server
   npm run client
   ```

### VPS Deployment

1. **Set up a VPS** (Digital Ocean, Linode, AWS EC2, etc.)

2. **Install required software**

   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
   sudo apt install -y nodejs
   
   # Install MongoDB
   wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
   sudo apt update
   sudo apt install -y mongodb-org
   sudo systemctl start mongod
   sudo systemctl enable mongod
   ```

3. **Clone and configure the application**

   ```bash
   git clone <repository-url>
   cd muscle-garage-crm
   npm install
   
   # Create .env file
   touch .env
   nano .env
   # Add environment variables as mentioned above
   ```

4. **Set up reverse proxy with Nginx**

   ```bash
   sudo apt install -y nginx
   
   # Configure Nginx
   sudo nano /etc/nginx/sites-available/musclegarage
   
   # Add the following configuration
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;
       
       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   
   # Enable the site
   sudo ln -s /etc/nginx/sites-available/musclegarage /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

5. **Set up SSL with Let's Encrypt**

   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

6. **Run the application with PM2**

   ```bash
   # Install PM2
   sudo npm install -g pm2
   
   # Start the application
   pm2 start server.js --name "musclegarage"
   pm2 startup
   pm2 save
   ```

## Database Connection

The application uses Mongoose to connect to MongoDB. The connection is established in `config/db.js` with the following features:

- Connection pooling
- Automatic reconnection
- Error handling
- Connection event listeners

## Available Scripts

- `npm run dev`: Run both client and server in development mode
- `npm run server`: Run only the backend server
- `npm run client`: Run only the frontend client
- `npm run build`: Build the client for production
- `npm run start`: Start the production server

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
