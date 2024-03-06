import { randomBytes } from "crypto";
import { OTP } from "../models/OTP.js";

export const generateOTP = async (email) => {
  const otp = randomBytes(3).toString('hex').toUpperCase();
  await OTP.create({
    userEmail: email,
    otp: otp
  });
  return otp
};
