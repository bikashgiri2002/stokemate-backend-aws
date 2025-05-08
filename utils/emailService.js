import nodemailer from "nodemailer";

// Create transporter with improved configuration
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false // Only for development/testing
  },
  pool: true, // Use connection pooling
  maxConnections: 5, // Maximum concurrent connections
  rateLimit: 5 // Max messages per second
});

// 🎉 Enhanced welcome email with modern design
export const sendConfirmationEmail = async (to, name) => {
  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; color: #333; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #6e8efb, #4a6cf7); padding: 30px; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 28px;">Welcome to StockMate!</h1>
        <p style="margin: 10px 0 0; opacity: 0.9;">Your shop management journey begins now</p>
      </div>
      
      <div style="padding: 30px;">
        <h2 style="color: #4a6cf7; margin-top: 0;">Hello, ${name}!</h2>
        
        <p>Thank you for choosing <strong>StockMate</strong> as your inventory management solution. We're excited to help streamline your business operations.</p>
        
        <div style="background-color: #f8f9fe; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #4a6cf7;">
          <p style="margin: 0 0 10px; font-weight: bold;">Quick Start Guide:</p>
          <ol style="margin: 0; padding-left: 20px;">
            <li style="margin-bottom: 8px;">Complete your shop profile setup</li>
            <li style="margin-bottom: 8px;">Add your products and categories</li>
            <li style="margin-bottom: 8px;">Configure your inventory settings</li>
            <li>Invite your team members</li>
          </ol>
        </div>
        
        <a href="https://stokematefrontend.onrender.com/dashboard" 
           style="display: inline-block; background: #4a6cf7; color: white; 
                  padding: 12px 24px; text-decoration: none; border-radius: 6px; 
                  font-weight: 600; margin: 15px 0; text-align: center;">
          Go to Dashboard
        </a>
        
        <p style="margin-bottom: 0;">Need help getting started? <a href="https://support.stockmate.com" style="color: #4a6cf7;">Visit our help center</a></p>
      </div>
      
      <div style="background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666;">
        <p style="margin: 0;">© ${new Date().getFullYear()} StockMate. All rights reserved.</p>
        <p style="margin: 5px 0 0;">123 Business Street, Tech City, TC 10001</p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"StockMate Support" <${process.env.EMAIL_USER}>`,
      to,
      subject: `🎉 Welcome to StockMate, ${name}! Your Shop is Ready`,
      html: htmlContent,
      priority: 'high'
    });
  } catch (error) {
    console.error("❌ Failed to send confirmation email:", error.message);
    throw new Error('Failed to send confirmation email');
  }
};

// 🔐 Secure password reset email with improved UX
export const sendPasswordResetEmail = async (to, name, resetURL) => {
  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; color: #333; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
      <div style="background: #f8f9fe; padding: 25px; text-align: center; border-bottom: 1px solid #e0e0e0;">
        <h2 style="margin: 0; color: #4a6cf7;">Password Reset Request</h2>
      </div>
      
      <div style="padding: 30px;">
        <p>Hello ${name},</p>
        
        <p>We received a request to reset your StockMate account password. Click the button below to proceed:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetURL}" 
             style="display: inline-block; background: #4a6cf7; color: white; 
                    padding: 14px 28px; text-decoration: none; border-radius: 6px; 
                    font-weight: 600; font-size: 16px;">
            Reset Password
          </a>
        </div>
        
        <div style="background-color: #fff8f8; padding: 15px; border-radius: 6px; border-left: 4px solid #ff5252; margin: 20px 0;">
          <p style="margin: 0; color: #ff5252; font-weight: 600;">⚠️ Security Notice</p>
          <p style="margin: 8px 0 0; font-size: 14px;">
            This link will expire in <strong>15 minutes</strong>. If you didn't request this change, 
            please <a href="mailto:security@stockmate.com" style="color: #4a6cf7;">contact our security team</a> immediately.
          </p>
        </div>
        
        <p style="font-size: 14px; color: #666; margin-bottom: 0;">
          Can't click the button? Copy this link to your browser:<br>
          <span style="word-break: break-all; color: #4a6cf7;">${resetURL}</span>
        </p>
      </div>
      
      <div style="background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666;">
        <p style="margin: 0;">For your security, never share this email with anyone.</p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"StockMate Security" <${process.env.EMAIL_USER}>`,
      to,
      subject: `🔒 Password Reset Request for ${name}'s StockMate Account`,
      html: htmlContent,
      priority: 'high'
    });
  } catch (error) {
    console.error("❌ Failed to send password reset email:", error.message);
    throw new Error('Failed to send password reset email');
  }
};

// 🔑 Modern OTP email with enhanced security features
export const sendOTPEmail = async (to, name, otp) => {
  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; color: #333; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
      <div style="background: #f8f9fe; padding: 25px; text-align: center; border-bottom: 1px solid #e0e0e0;">
        <h2 style="margin: 0; color: #4a6cf7;">Verification Code Required</h2>
      </div>
      
      <div style="padding: 30px;">
        <p>Hello ${name},</p>
        
        <p>Please use the following verification code to complete your action on StockMate:</p>
        
        <div style="background: #f8f9fe; border-radius: 8px; padding: 20px; text-align: center; 
                    margin: 25px 0; border: 1px dashed #4a6cf7; font-family: monospace;">
          <div style="font-size: 32px; font-weight: 700; letter-spacing: 5px; color: #4a6cf7;">
            ${otp.match(/.{1}/g).join(' ')} <!-- Adds spacing between OTP digits -->
          </div>
          <div style="font-size: 14px; color: #666; margin-top: 10px;">
            Valid for 10 minutes
          </div>
        </div>
        
        <div style="background-color: #fff8f8; padding: 15px; border-radius: 6px; border-left: 4px solid #ff5252; margin: 20px 0;">
          <p style="margin: 0; color: #ff5252; font-weight: 600;">⚠️ Security Alert</p>
          <p style="margin: 8px 0 0; font-size: 14px;">
            Never share this code with anyone, including StockMate support. 
            We will never ask for your verification code.
          </p>
        </div>
        
        <p style="font-size: 14px; color: #666; margin-bottom: 0;">
          If you didn't request this code, please <a href="mailto:security@stockmate.com" style="color: #4a6cf7;">contact us</a> immediately.
        </p>
      </div>
      
      <div style="background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666;">
        <p style="margin: 0;">This is an automated message. Please do not reply.</p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"StockMate Verification" <${process.env.EMAIL_USER}>`,
      to,
      subject: `🔑 Your StockMate Verification Code: ${otp}`,
      html: htmlContent,
      priority: 'high'
    });
  } catch (error) {
    console.error("❌ Failed to send OTP email:", error.message);
    throw new Error('Failed to send OTP email');
  }
};