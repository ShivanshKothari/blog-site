import mongoose from "mongoose";

// OTP schema
const OTPSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true
  },
  otp: {
    type: String,
    required: true
  },
  expireAt: {
    type: Date,
    default: Date.now(),
    expires: 120,
  },
});

// Create Schema
export const OTP = mongoose.model('otp', OTPSchema);