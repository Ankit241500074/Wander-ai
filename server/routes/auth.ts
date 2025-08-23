import { RequestHandler } from "express";
import { z } from "zod";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User, LoginRequest, SignupRequest, AuthResponse } from "@shared/auth";

// Mock database - in production, use a real database
interface UserDB extends Omit<User, 'id'> {
  id: string;
  password: string;
}

// Initialize users with correct password hashes
const users: UserDB[] = [];

// Helper function to initialize demo users
const initializeDemoUsers = async () => {
  if (users.length === 0) {
    const adminPassword = await hashPassword("admin123");
    const userPassword = await hashPassword("password123");

    users.push(
      {
        id: "1",
        email: "admin@wanderai.com",
        name: "Admin User",
        role: "admin",
        password: adminPassword,
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        email: "user@wanderai.com",
        name: "Demo User",
        role: "user",
        password: userPassword,
        createdAt: new Date().toISOString(),
      }
    );
  }
};

// Validation schemas
const LoginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required")
});

const SignupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[a-z]/, "Password must contain a lowercase letter")
    .regex(/\d/, "Password must contain a number"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

// Helper functions
const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
};

const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

const findUserByEmail = (email: string): UserDB | undefined => {
  return users.find(user => user.email.toLowerCase() === email.toLowerCase());
};

const findUserById = (id: string): UserDB | undefined => {
  return users.find(user => user.id === id);
};

const createUser = async (userData: SignupRequest): Promise<UserDB> => {
  const hashedPassword = await hashPassword(userData.password);
  const newUser: UserDB = {
    id: (users.length + 1).toString(),
    email: userData.email.toLowerCase(),
    name: userData.name,
    role: "user",
    password: hashedPassword,
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  return newUser;
};

const sanitizeUser = (user: UserDB): User => {
  const { password, ...sanitized } = user;
  return sanitized;
};

// Route handlers
export const loginHandler: RequestHandler = async (req, res) => {
  try {
    // Initialize demo users if not already done
    await initializeDemoUsers();

    const validatedData = LoginSchema.parse(req.body);
    
    const user = findUserByEmail(validatedData.email);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password"
      } as AuthResponse);
    }

    const isPasswordValid = await comparePassword(validatedData.password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password"
      } as AuthResponse);
    }

    const token = generateToken(user.id);
    const sanitizedUser = sanitizeUser(user);

    res.json({
      success: true,
      user: sanitizedUser,
      token,
      message: "Login successful"
    } as AuthResponse);

  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        error: "Invalid input data",
        details: error.errors
      } as AuthResponse);
    } else {
      console.error("Login error:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error"
      } as AuthResponse);
    }
  }
};

export const signupHandler: RequestHandler = async (req, res) => {
  try {
    // Initialize demo users if not already done
    await initializeDemoUsers();

    const validatedData = SignupSchema.parse(req.body);

    // Check if user already exists
    const existingUser = findUserByEmail(validatedData.email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: "An account with this email already exists"
      } as AuthResponse);
    }

    // Create new user
    const newUser = await createUser(validatedData);
    const token = generateToken(newUser.id);
    const sanitizedUser = sanitizeUser(newUser);

    res.status(201).json({
      success: true,
      user: sanitizedUser,
      token,
      message: "Account created successfully"
    } as AuthResponse);

  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        error: "Invalid input data",
        details: error.errors
      } as AuthResponse);
    } else {
      console.error("Signup error:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error"
      } as AuthResponse);
    }
  }
};

export const verifyTokenHandler: RequestHandler = async (req, res) => {
  try {
    // Initialize demo users if not already done
    await initializeDemoUsers();

    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: "No token provided"
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = findUserById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid token"
      });
    }

    const sanitizedUser = sanitizeUser(user);

    res.json({
      success: true,
      user: sanitizedUser
    });

  } catch (error) {
    res.status(401).json({
      success: false,
      error: "Invalid token"
    });
  }
};

export const getUsersHandler: RequestHandler = async (req, res) => {
  try {
    // Initialize demo users if not already done
    await initializeDemoUsers();

    // This endpoint is for admin use only
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: "No token provided"
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const adminUser = findUserById(decoded.userId);

    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: "Admin access required"
      });
    }

    const sanitizedUsers = users.map(sanitizeUser);

    res.json({
      success: true,
      data: sanitizedUsers,
      total: sanitizedUsers.length
    });

  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
};

// Middleware to verify JWT token
export const authenticateToken: RequestHandler = async (req, res, next) => {
  try {
    // Initialize demo users if not already done
    await initializeDemoUsers();

    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      console.log('Authentication failed: No token provided');
      return res.status(401).json({
        success: false,
        error: "Access token required"
      });
    }

    console.log('Verifying JWT token...');
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    console.log('Token verified successfully for user:', decoded.userId);

    const user = findUserById(decoded.userId);

    if (!user) {
      console.log('Authentication failed: User not found for userId:', decoded.userId);
      return res.status(401).json({
        success: false,
        error: "User not found"
      });
    }

    console.log('Authentication successful for user:', user.email);
    // Add user to request object
    (req as any).user = sanitizeUser(user);
    next();

  } catch (error) {
    console.error('JWT Authentication error:', error);

    let errorMessage = "Invalid token";

    if (error instanceof jwt.TokenExpiredError) {
      errorMessage = "Token expired - please login again";
      console.log('Token expired, user needs to login again');
    } else if (error instanceof jwt.JsonWebTokenError) {
      errorMessage = "Invalid token format";
      console.log('Invalid JWT format or signature');
    } else if (error instanceof jwt.NotBeforeError) {
      errorMessage = "Token not active yet";
    }

    res.status(401).json({
      success: false,
      error: errorMessage
    });
  }
};

// Middleware to check admin role
export const requireAdmin: RequestHandler = (req, res, next) => {
  const user = (req as any).user;
  
  if (!user || user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: "Admin access required"
    });
  }
  
  next();
};
