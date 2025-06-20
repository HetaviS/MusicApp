import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface Config {
  nodeEnv: string;
  port: number;
  mongoUri: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  socketPath: string;
  clientUrl: string;
  oneSignalAppId: string;
  oneSignalApiKey: string;
  secret: string;
  email_service: string;
  email_host: string;
  email_port: string;
  email_user: string;
  email_pass: string;
  frontend_url: string;
}

export const config: Config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/chat-saas',
  jwtSecret: process.env.JWT_SECRET || 'secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  socketPath: process.env.SOCKET_PATH || '/socket.io',
  clientUrl: process.env.CLIENT_URL || 'http://192.168.0.11:3000',
  oneSignalAppId: process.env.ONE_SIGNAL_APP_ID || '',
  oneSignalApiKey: process.env.ONE_SIGNAL_API_KEY || '',
  secret: process.env.SECRET || 'secret',
  email_service: process.env.EMAIL_SERVICE || "gmail",
  email_host: process.env.EMAIL_HOST || "smtp.gmail.com",
  email_port: process.env.EMAIL_PORT || "587",
  email_user: process.env.EMAIL_USER || "hetavi.primocys@gmail.com",
  email_pass: process.env.EMAIL_PAAS || "oizq evlo gpfj mfjo",
  frontend_url: process.env.FRONTEND_URL || "http://localhost:3000",
};

// Database configuration
export const dbConfig = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: true,
};

// Cors configuration
export const corsConfig = {
  origin: config.clientUrl,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
};

// Socket.IO configuration
export const socketConfig = {
  path: config.socketPath,
  cors: corsConfig
};
export const emailConfig = {
  service: config.email_service,
  host: config.email_host,
  port: config.email_port,
  user: config.email_user,
  pass: config.email_pass,
};

// JWT configuration
export const jwtConfig = {
  secret: config.jwtSecret,
  expiresIn: config.jwtExpiresIn
};