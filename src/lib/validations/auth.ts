import * as z from "zod"

// Update your validation schema
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
})

export const signupSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(12),
  password: z.string().min(8),
  full_name: z.string().min(1, "Full name is required"),
  income_per_month: z.number().positive(),
  savings_per_month: z.number().min(0),
  yellow_threshold: z.number().positive(),
  orange_threshold: z.number().positive(),
  red_threshold: z.number().positive(),
})

export const otpSchema = z.object({
  code: z.string().length(6, "OTP must be 6 digits"),
});

export const loginWithOtpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
  otp: z.string().length(6).optional(),
})

export type LoginInput = z.infer<typeof loginSchema>
export type SignupInput = z.infer<typeof signupSchema>
export type OTPFormData = z.infer<typeof otpSchema>;
export type LoginWithOTPFormData = z.infer<typeof loginWithOtpSchema>;