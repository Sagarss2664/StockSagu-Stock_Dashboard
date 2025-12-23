const express = require('express'); //REST API
const http = require('http');//needed for web sckets
const socketIo = require('socket.io'); // Real time stock updates
const cors = require('cors'); // security
const helmet = require('helmet'); // security
const dotenv = require('dotenv'); // environment variables
const mongoose = require('mongoose'); // MongoDB connection
const SibApiV3Sdk = require('sib-api-v3-sdk');//Brevo Email Service



// Load environment variables
dotenv.config();

// Initialize Brevo
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const emailApi = new SibApiV3Sdk.TransactionalEmailsApi();

// OTP Store (in-memory - consider using Redis in production)
const otpStore = new Map();
const User = require('./models/User');


// Import routes
const authRoutes = require('./routes/authRoutes');
const stockRoutes = require('./routes/stockRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const chartRoutes = require('./routes/chartRoutes');

// Import services
const { startStockPolling } = require('./services/stockService');
const { initializeSocket } = require('./services/socketService');

const app = express();
const server = http.createServer(app);

// Configure Socket.IO
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());



// MongoDB Connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://01fe22bcs259:Sagar@cluster0.v0jo1.mongodb.net/Stock_dashboard';
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB Connected to:', mongoose.connection.name);
    
    // IMPORTANT: Force create StockHistory collection if it doesn't exist
    const db = mongoose.connection.db;
    
    // Check if stockhistories collection exists
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    console.log('📊 Existing Collections:', collectionNames);
    
    if (!collectionNames.includes('stockhistories')) {
      console.log('⚠️  stockhistories collection does not exist. Creating...');
      
      // Create the collection by inserting a dummy document
      const StockHistory = require('./models/StockHistory');
      const dummyDoc = new StockHistory({
        symbol: 'INIT',
        price: 0,
        timestamp: new Date()
      });
      await dummyDoc.save();
      console.log('✅ Created stockhistories collection');
      
      // Now drop the dummy document
      await StockHistory.deleteOne({ symbol: 'INIT' });
      console.log('✅ Cleared dummy document');
    }
    
    // Verify StockHistory collection exists
    const updatedCollections = await db.listCollections().toArray();
    console.log('📊 Updated Collections:', updatedCollections.map(c => c.name));
    
    // Create TTL index for automatic cleanup (24 hours)
    try {
      const StockHistory = require('./models/StockHistory');
      
      // Check if TTL index exists
      const indexes = await StockHistory.collection.getIndexes();
      console.log('📈 Existing indexes:', Object.keys(indexes));
      
      // Drop existing timestamp index if it exists without TTL
      if (indexes.timestamp_1 && !indexes.timestamp_1.expireAfterSeconds) {
        console.log('🗑️  Dropping old timestamp index...');
        await StockHistory.collection.dropIndex('timestamp_1');
      }
      
      // Create new TTL index with 24-hour expiry
      await StockHistory.collection.createIndex(
        { timestamp: 1 },
        { 
          expireAfterSeconds: 24 * 60 * 60, // 24 hours
          name: 'timestamp_ttl'
        }
      );
      console.log('✅ Created TTL index (24-hour expiry)');
      
    } catch (indexError) {
      console.log('⚠️  Index creation warning:', indexError.message);
    }
    
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    console.log('⚠️  Continuing without MongoDB - using in-memory storage only');
  }
};

connectDB();

// // OTP Routes
// app.post("/api/auth/send-otp", async (req, res) => {
//   try {
//     const { email } = req.body;
    
//     if (!email) {
//       return res.status(400).json({ 
//         success: false, 
//         error: "Email is required" 
//       });
//     }
    
//     // Validate email format
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       return res.status(400).json({ 
//         success: false, 
//         error: "Invalid email format" 
//       });
//     }
    
//     // Check if OTP was recently sent (cooldown period)
//     const lastOtpTime = otpStore.get(`${email}_time`);
//     if (lastOtpTime && (Date.now() - lastOtpTime) < 60000) { // 60 seconds cooldown
//       return res.status(429).json({
//         success: false,
//         error: "Please wait before requesting a new OTP",
//         retryAfter: Math.ceil((60000 - (Date.now() - lastOtpTime)) / 1000)
//       });
//     }
    
//     // Generate 6-digit OTP
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
//     // Store OTP with expiration (10 minutes)
//     otpStore.set(email, {
//       otp: otp,
//       expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
//       attempts: 0
//     });
    
//     // Store timestamp for cooldown
//     otpStore.set(`${email}_time`, Date.now());
  

//     const sendSmtpEmail = {
//   sender: { 
//     name: "StockSagu Dashboard", 
//     email: process.env.EMAIL_FROM || "sagu20102004@gmail.com" 
//   },
//   to: [{ email: email }],
//   subject: "Welcome to StockSagu - Your Secure OTP Verification Code",
//   htmlContent: `
//     <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; padding: 25px; border: 1px solid #dcdcdc; border-radius: 12px; background: #fafafa;">
      
//       <h2 style="color: #2c3e50; text-align: center; margin-bottom: 10px;">
//         StockSagu Account Verification
//       </h2>

//       <p style="font-size: 15px; color: #333;">
//         Dear User,
//       </p>

//       <p style="font-size: 15px; color: #333; line-height: 1.6;">
//         Thank you for choosing <strong>StockSagu</strong> — your unified dashboard for tracking, analyzing, 
//         and subscribing to real-time stock market data.  
//         To ensure the security of your account, we require a quick verification.
//       </p>

//       <p style="font-size: 15px; margin-top: 20px;">
//         Please use the following One-Time Password (OTP) to complete your login:
//       </p>

//       <!-- OTP BOX -->
//       <div style="text-align: center; margin: 35px 0;">
//         <div style="
//           display: inline-block;
//           background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//           color: white;
//           padding: 20px 35px;
//           border-radius: 10px;
//           font-size: 40px;
//           font-weight: 900;
//           letter-spacing: 10px;
//           box-shadow: 0 4px 12px rgba(0,0,0,0.15);
//         ">
//           ${otp}
//         </div>
//       </div>

//       <p style="font-size: 15px; line-height: 1.6; color: #333;">
//         This OTP will remain valid for the next <strong>10 minutes</strong>.  
//         For your protection, please do not share this code with anyone.
//       </p>

//       <p style="font-size: 15px; color: #333; margin-top: 20px; line-height: 1.6;">
//         If you did not request this verification, simply ignore this email.  
//         Our system ensures that no changes are made without correct authentication.
//       </p>

//       <hr style="border: none; border-top: 1px solid #dcdcdc; margin: 25px 0;">

//       <p style="color: #7f8c8d; font-size: 12px; text-align: center; line-height: 1.5;">
//         © ${new Date().getFullYear()} StockSagu Dashboard.<br>
//         Secure • Real-time • Market Insights.
//       </p>
//     </div>
//   `,
//   textContent: `Your StockSagu OTP is: ${otp}. It is valid for 10 minutes. Do not share it with anyone.`
// };

//     try {
//       const response = await emailApi.sendTransacEmail(sendSmtpEmail);
//       console.log(`📧 OTP sent to ${email}:`, response.messageId);
      
//       res.json({ 
//         success: true, 
//         message: "OTP sent successfully",
//         expiresIn: 600 // 10 minutes in seconds
//       });
//     } catch (emailError) {
//       console.error("📧 Email sending error:", emailError);
      
//       // Clean up stored OTP on email error
//       otpStore.delete(email);
//       otpStore.delete(`${email}_time`);
      
//       res.status(500).json({ 
//         success: false, 
//         error: "Failed to send OTP. Please try again." 
//       });
//     }

//   } catch (err) {
//     console.error("❌ Send OTP error:", err);
//     res.status(500).json({ 
//       success: false, 
//       error: "Internal server error" 
//     });
//   }
// });


// app.post("/api/auth/verify-otp", (req, res) => {
//   try {
//     const { email, otp } = req.body;
    
//     if (!email || !otp) {
//       return res.status(400).json({ 
//         success: false, 
//         error: "Email and OTP are required" 
//       });
//     }
    
//     const storedOtpData = otpStore.get(email);
    
//     if (!storedOtpData) {
//       return res.status(404).json({ 
//         success: false, 
//         error: "OTP not found or expired" 
//       });
//     }
    
//     // Check if OTP has expired
//     if (Date.now() > storedOtpData.expiresAt) {
//       otpStore.delete(email);
//       return res.status(400).json({ 
//         success: false, 
//         error: "OTP has expired. Please request a new one." 
//       });
//     }
    
//     // Check max attempts (5 attempts)
//     if (storedOtpData.attempts >= 5) {
//       otpStore.delete(email);
//       return res.status(400).json({ 
//         success: false, 
//         error: "Too many failed attempts. OTP has been invalidated." 
//       });
//     }
    
//     // Increment attempts
//     storedOtpData.attempts += 1;
//     otpStore.set(email, storedOtpData);
    
//     // Verify OTP
//     if (storedOtpData.otp !== otp) {
//       return res.status(400).json({ 
//         success: false, 
//         error: "Invalid OTP. Please try again.",
//         attemptsLeft: 5 - storedOtpData.attempts
//       });
//     }
    
//     // OTP verified successfully
//     otpStore.delete(email);
//     otpStore.delete(`${email}_time`);
    
//     // Generate a mock user (in production, this would come from your database)
//     const user = {
//       id: new mongoose.Types.ObjectId().toString(), // FIXED: Added 'new'
//       email: email,
//       name: email.split('@')[0],
//       createdAt: new Date(),
//       subscriptions: []
//     };
    
//     // Generate a token (in production, use JWT)
//     const token = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
//     res.json({ 
//       success: true, 
//       message: "OTP verified successfully",
//       token: token,
//       user: user,
//       expiresIn: 24 * 60 * 60 // 24 hours in seconds
//     });
    
//   } catch (err) {
//     console.error("❌ Verify OTP error:", err);
//     res.status(500).json({ 
//       success: false, 
//       error: "Internal server error" 
//     });
//   }
// });
// app.post("/api/auth/resend-otp", async (req, res) => {
//   try {
//     const { email } = req.body;
    
//     if (!email) {
//       return res.status(400).json({ 
//         success: false, 
//         error: "Email is required" 
//       });
//     }
    
//     // Check cooldown period
//     const lastOtpTime = otpStore.get(`${email}_time`);
//     if (lastOtpTime && (Date.now() - lastOtpTime) < 60000) {
//       return res.status(429).json({
//         success: false,
//         error: "Please wait before requesting a new OTP",
//         retryAfter: Math.ceil((60000 - (Date.now() - lastOtpTime)) / 1000)
//       });
//     }
    
//     // Generate new OTP
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
//     // Store new OTP with expiration
//     otpStore.set(email, {
//       otp: otp,
//       expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
//       attempts: 0
//     });
    
//     // Update timestamp
//     otpStore.set(`${email}_time`, Date.now());
    
//     // Send email
//     const sendSmtpEmail = {
//       sender: { 
//         name: "Stock Dashboard", 
//         email: process.env.EMAIL_FROM || "noreply@stockdashboard.com" 
//       },
//       to: [{ email: email }],
//       subject: "Your Stock Dashboard OTP Code (Resent)",
//       htmlContent: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
//           <h2 style="color: #2c3e50; text-align: center;">Stock Dashboard OTP Verification</h2>
//           <p>Hello,</p>
//           <p>Your new One-Time Password (OTP) for accessing the Stock Dashboard is:</p>
//           <div style="text-align: center; margin: 30px 0;">
//             <div style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; border-radius: 8px; font-size: 28px; font-weight: bold; letter-spacing: 5px;">
//               ${otp}
//             </div>
//           </div>
//           <p>This OTP is valid for <strong>10 minutes</strong>. Do not share this code with anyone.</p>
//           <p>If you didn't request this OTP, please ignore this email.</p>
//           <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
//           <p style="color: #7f8c8d; font-size: 12px; text-align: center;">
//             © ${new Date().getFullYear()} Stock Dashboard. All rights reserved.
//           </p>
//         </div>
//       `,
//       textContent: `Your new Stock Dashboard OTP is: ${otp}. This OTP is valid for 10 minutes.`
//     };

//     try {
//       const response = await emailApi.sendTransacEmail(sendSmtpEmail);
//       console.log(`📧 OTP resent to ${email}:`, response.messageId);
      
//       res.json({ 
//         success: true, 
//         message: "OTP resent successfully",
//         expiresIn: 600 // 10 minutes in seconds
//       });
//     } catch (emailError) {
//       console.error("📧 Resend email error:", emailError);
      
//       // Clean up on error
//       otpStore.delete(email);
//       otpStore.delete(`${email}_time`);
      
//       res.status(500).json({ 
//         success: false, 
//         error: "Failed to resend OTP. Please try again." 
//       });
//     }
    
//   } catch (err) {
//     console.error("❌ Resend OTP error:", err);
//     res.status(500).json({ 
//       success: false, 
//       error: "Internal server error" 
//     });
//   }
// });

// // Clean up expired OTPs periodically (every 5 minutes)
// setInterval(() => {
//   const now = Date.now();
//   let cleanedCount = 0;
  
//   for (const [key, value] of otpStore.entries()) {
//     if (key.endsWith('_time')) continue; // Skip timestamps
    
//     if (now > value.expiresAt) {
//       otpStore.delete(key);
//       otpStore.delete(`${key}_time`);
//       cleanedCount++;
//     }
//   }
  
//   if (cleanedCount > 0) {
//     console.log(`🧹 Cleaned ${cleanedCount} expired OTPs`);
//   }
// }, 5 * 60 * 1000); // 5 minutes


// Add User import at the top of server.js (with other imports)

// OTP Routes
app.post("/api/auth/send-otp", async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        error: "Email is required" 
      });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        error: "Invalid email format" 
      });
    }
    
    // Check if OTP was recently sent (cooldown period)
    const lastOtpTime = otpStore.get(`${email}_time`);
    if (lastOtpTime && (Date.now() - lastOtpTime) < 60000) { // 60 seconds cooldown
      return res.status(429).json({
        success: false,
        error: "Please wait before requesting a new OTP",
        retryAfter: Math.ceil((60000 - (Date.now() - lastOtpTime)) / 1000)
      });
    }
    
    // Check if user exists in database (optional - for logging purposes)
    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });
    
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP with expiration (10 minutes)
    otpStore.set(normalizedEmail, {
      otp: otp,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
      attempts: 0
    });
    
    // Store timestamp for cooldown
    otpStore.set(`${normalizedEmail}_time`, Date.now());
    
    // Log OTP generation (remove in production)
    console.log(`📱 Generated OTP for ${normalizedEmail}: ${otp}`);
    if (existingUser) {
      console.log(`📝 Existing user: ${existingUser._id}`);
    }

    // Send OTP email
    const sendSmtpEmail = {
      sender: { 
        name: "StockSagu Dashboard", 
        email: process.env.EMAIL_FROM || "sagu20102004@gmail.com" 
      },
      to: [{ email: normalizedEmail }],
      subject: "Welcome to StockSagu - Your Secure OTP Verification Code",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; padding: 25px; border: 1px solid #dcdcdc; border-radius: 12px; background: #fafafa;">
          
          <h2 style="color: #2c3e50; text-align: center; margin-bottom: 10px;">
            StockSagu Account Verification
          </h2>

          <p style="font-size: 15px; color: #333;">
            Dear User,
          </p>

          <p style="font-size: 15px; color: #333; line-height: 1.6;">
            Thank you for choosing <strong>StockSagu</strong> — your unified dashboard for tracking, analyzing, 
            and subscribing to real-time stock market data.  
            To ensure the security of your account, we require a quick verification.
          </p>

          <p style="font-size: 15px; margin-top: 20px;">
            Please use the following One-Time Password (OTP) to complete your login:
          </p>

          <!-- OTP BOX -->
          <div style="text-align: center; margin: 35px 0;">
            <div style="
              display: inline-block;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 20px 35px;
              border-radius: 10px;
              font-size: 40px;
              font-weight: 900;
              letter-spacing: 10px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            ">
              ${otp}
            </div>
          </div>

          <p style="font-size: 15px; line-height: 1.6; color: #333;">
            This OTP will remain valid for the next <strong>10 minutes</strong>.  
            For your protection, please do not share this code with anyone.
          </p>

          <p style="font-size: 15px; color: #333; margin-top: 20px; line-height: 1.6;">
            If you did not request this verification, simply ignore this email.  
            Our system ensures that no changes are made without correct authentication.
          </p>

          <hr style="border: none; border-top: 1px solid #dcdcdc; margin: 25px 0;">

          <p style="color: #7f8c8d; font-size: 12px; text-align: center; line-height: 1.5;">
            © ${new Date().getFullYear()} StockSagu Dashboard.<br>
            Secure • Real-time • Market Insights.
          </p>
        </div>
      `,
      textContent: `Your StockSagu OTP is: ${otp}. It is valid for 10 minutes. Do not share it with anyone.`
    };

    try {
      const response = await emailApi.sendTransacEmail(sendSmtpEmail);
      console.log(`📧 OTP sent to ${normalizedEmail}:`, response.messageId);
      
      res.json({ 
        success: true, 
        message: "OTP sent successfully",
        email: normalizedEmail,
        expiresIn: 600 // 10 minutes in seconds
      });
    } catch (emailError) {
      console.error("📧 Email sending error:", emailError);
      
      // Clean up stored OTP on email error
      otpStore.delete(normalizedEmail);
      otpStore.delete(`${normalizedEmail}_time`);
      
      res.status(500).json({ 
        success: false, 
        error: "Failed to send OTP. Please try again." 
      });
    }

  } catch (err) {
    console.error("❌ Send OTP error:", err);
    res.status(500).json({ 
      success: false, 
      error: "Internal server error" 
    });
  }
});

app.post("/api/auth/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    if (!email || !otp) {
      return res.status(400).json({ 
        success: false, 
        error: "Email and OTP are required" 
      });
    }
    
    const normalizedEmail = email.toLowerCase().trim();
    const storedOtpData = otpStore.get(normalizedEmail);
    
    if (!storedOtpData) {
      return res.status(400).json({ 
        success: false, 
        error: "OTP not found or expired. Please request a new OTP." 
      });
    }
    
    // Check if OTP has expired
    if (Date.now() > storedOtpData.expiresAt) {
      otpStore.delete(normalizedEmail);
      otpStore.delete(`${normalizedEmail}_time`);
      return res.status(400).json({ 
        success: false, 
        error: "OTP has expired. Please request a new one." 
      });
    }
    
    // Check max attempts (5 attempts)
    if (storedOtpData.attempts >= 5) {
      otpStore.delete(normalizedEmail);
      otpStore.delete(`${normalizedEmail}_time`);
      return res.status(400).json({ 
        success: false, 
        error: "Too many failed attempts. OTP has been invalidated." 
      });
    }
    
    // Increment attempts
    storedOtpData.attempts += 1;
    otpStore.set(normalizedEmail, storedOtpData);
    
    // Verify OTP
    if (storedOtpData.otp !== otp) {
      const attemptsLeft = 5 - storedOtpData.attempts;
      return res.status(400).json({ 
        success: false, 
        error: `Invalid OTP. ${attemptsLeft} attempts remaining.`,
        attemptsLeft: attemptsLeft
      });
    }
    
    // OTP verified successfully - clear OTP data
    otpStore.delete(normalizedEmail);
    otpStore.delete(`${normalizedEmail}_time`);
    
    // ✅ CRITICAL: Find or create user in database
    let user = await User.findOne({ email: normalizedEmail });
    
    if (!user) {
      // Create new user
      user = new User({
        email: normalizedEmail
      });
      await user.save();
      console.log(`✅ Created new user: ${user.email} (ID: ${user._id})`);
    } else {
      console.log(`✅ Existing user logged in: ${user.email} (ID: ${user._id})`);
    }
    
    // Generate a token (in production, use JWT)
    const token = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Return user data with CONSISTENT ID from database
    res.json({ 
      success: true, 
      message: "OTP verified successfully",
      token: token,
      user: {
        id: user._id.toString(), // ✅ This is the FIX - consistent database ID
        email: user.email,
        createdAt: user.createdAt
      },
      expiresIn: 24 * 60 * 60 // 24 hours in seconds
    });
    
  } catch (err) {
    console.error("❌ Verify OTP error:", err);
    
    // Handle MongoDB duplicate key error
    if (err.code === 11000) {
      return res.status(409).json({ 
        success: false, 
        error: "User already exists. Please try logging in again." 
      });
    }
    
    // Handle database connection errors
    if (err.name === 'MongoNetworkError') {
      return res.status(503).json({ 
        success: false, 
        error: "Database temporarily unavailable. Please try again." 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      error: "Internal server error" 
    });
  }
});

app.post("/api/auth/resend-otp", async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        error: "Email is required" 
      });
    }
    
    const normalizedEmail = email.toLowerCase().trim();
    
    // Check cooldown period
    const lastOtpTime = otpStore.get(`${normalizedEmail}_time`);
    if (lastOtpTime && (Date.now() - lastOtpTime) < 60000) {
      return res.status(429).json({
        success: false,
        error: "Please wait before requesting a new OTP",
        retryAfter: Math.ceil((60000 - (Date.now() - lastOtpTime)) / 1000)
      });
    }
    
    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store new OTP with expiration
    otpStore.set(normalizedEmail, {
      otp: otp,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
      attempts: 0
    });
    
    // Update timestamp
    otpStore.set(`${normalizedEmail}_time`, Date.now());
    
    // Log OTP resend (remove in production)
    console.log(`📱 Resent OTP for ${normalizedEmail}: ${otp}`);
    
    // Send email
    const sendSmtpEmail = {
      sender: { 
        name: "StockSagu Dashboard", 
        email: process.env.EMAIL_FROM || "sagu20102004@gmail.com" 
      },
      to: [{ email: normalizedEmail }],
      subject: "Your StockSagu OTP Code (Resent)",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #2c3e50; text-align: center;">StockSagu OTP Verification</h2>
          <p>Hello,</p>
          <p>Your new One-Time Password (OTP) for accessing StockSagu is:</p>
          <div style="text-align: center; margin: 30px 0;">
            <div style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; border-radius: 8px; font-size: 28px; font-weight: bold; letter-spacing: 5px;">
              ${otp}
            </div>
          </div>
          <p>This OTP is valid for <strong>10 minutes</strong>. Do not share this code with anyone.</p>
          <p>If you didn't request this OTP, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
          <p style="color: #7f8c8d; font-size: 12px; text-align: center;">
            © ${new Date().getFullYear()} StockSagu Dashboard. All rights reserved.
          </p>
        </div>
      `,
      textContent: `Your new StockSagu OTP is: ${otp}. This OTP is valid for 10 minutes.`
    };

    try {
      const response = await emailApi.sendTransacEmail(sendSmtpEmail);
      console.log(`📧 OTP resent to ${normalizedEmail}:`, response.messageId);
      
      res.json({ 
        success: true, 
        message: "OTP resent successfully",
        email: normalizedEmail,
        expiresIn: 600 // 10 minutes in seconds
      });
    } catch (emailError) {
      console.error("📧 Resend email error:", emailError);
      
      // Clean up on error
      otpStore.delete(normalizedEmail);
      otpStore.delete(`${normalizedEmail}_time`);
      
      res.status(500).json({ 
        success: false, 
        error: "Failed to resend OTP. Please try again." 
      });
    }
    
  } catch (err) {
    console.error("❌ Resend OTP error:", err);
    res.status(500).json({ 
      success: false, 
      error: "Internal server error" 
    });
  }
});

// Clean up expired OTPs periodically (every 5 minutes)
setInterval(() => {
  const now = Date.now();
  let cleanedCount = 0;
  
  for (const [key, value] of otpStore.entries()) {
    if (key.endsWith('_time')) continue; // Skip timestamps
    
    if (now > value.expiresAt) {
      otpStore.delete(key);
      otpStore.delete(`${key}_time`);
      cleanedCount++;
    }
  }
  
  if (cleanedCount > 0) {
    console.log(`🧹 Cleaned ${cleanedCount} expired OTPs`);
  }
}, 5 * 60 * 1000); // 5 minutes

// Debug endpoint to check users and OTPs
app.get('/debug/auth-status', async (req, res) => {
  try {
    // Get all users from database
    const users = await User.find({}).sort({ createdAt: -1 }).limit(10);
    
    // Get OTP store status
    const otpData = {};
    for (const [key, value] of otpStore.entries()) {
      if (key.endsWith('_time')) {
        otpData[key] = {
          type: 'timestamp',
          value: new Date(value).toISOString(),
          age: Math.floor((Date.now() - value) / 1000) + 's'
        };
      } else {
        otpData[key] = {
          type: 'otp',
          otp: value.otp ? '******' : 'none',
          expiresAt: new Date(value.expiresAt).toISOString(),
          attempts: value.attempts,
          expiresIn: Math.max(0, Math.floor((value.expiresAt - Date.now()) / 1000)) + 's',
          isValid: Date.now() < value.expiresAt
        };
      }
    }
    
    res.json({
      success: true,
      database: {
        connected: mongoose.connection.readyState === 1,
        name: mongoose.connection.name,
        userCount: users.length
      },
      users: users.map(user => ({
        id: user._id,
        email: user.email,
        createdAt: user.createdAt
      })),
      otpStore: {
        size: otpStore.size,
        data: otpData
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/charts', chartRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    database: mongoose.connection.name || 'N/A',
    collections: mongoose.connection.db ? 'Available' : 'N/A',
    timestamp: new Date().toISOString(),
    otpStoreSize: otpStore.size
  });
});

// Debug endpoint to check collections
app.get('/debug/db', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    // Count documents in each collection
    const counts = {};
    for (const name of collectionNames) {
      const count = await db.collection(name).countDocuments();
      counts[name] = count;
    }
    
    res.json({
      connected: mongoose.connection.readyState === 1,
      database: mongoose.connection.name,
      collections: collectionNames,
      counts: counts,
      stockhistories: counts.stockhistories || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Debug endpoint for OTP store
app.get('/debug/otp-store', (req, res) => {
  const otpData = {};
  for (const [key, value] of otpStore.entries()) {
    if (key.endsWith('_time')) {
      otpData[key] = {
        timestamp: new Date(value).toISOString(),
        age: Math.floor((Date.now() - value) / 1000) + 's'
      };
    } else {
      otpData[key] = {
        otp: value.otp ? '******' : 'none',
        expiresAt: new Date(value.expiresAt).toISOString(),
        attempts: value.attempts,
        expiresIn: Math.max(0, Math.floor((value.expiresAt - Date.now()) / 1000)) + 's'
      };
    }
  }
  
  res.json({
    size: otpStore.size,
    data: otpData
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Stock Dashboard API',
    version: '1.0.0',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    endpoints: {
      auth: {
        sendOtp: 'POST /api/auth/send-otp',
        verifyOtp: 'POST /api/auth/verify-otp',
        resendOtp: 'POST /api/auth/resend-otp'
      },
      stocks: '/api/stocks',
      subscriptions: '/api/subscriptions',
      charts: '/api/charts',
      health: '/health',
      debug: {
        db: '/debug/db',
        otp: '/debug/otp-store'
      }
    }
  });
});

// Initialize services
initializeSocket(io);
startStockPolling(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 WebSocket: ws://localhost:${PORT}`);
  console.log(`🌐 Frontend: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log(`🗄️  MongoDB: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
  console.log(`📧 Brevo Email: ${process.env.BREVO_API_KEY ? 'Configured' : 'Not configured'}`);
  console.log(`🔐 OTP System: Active`);
});