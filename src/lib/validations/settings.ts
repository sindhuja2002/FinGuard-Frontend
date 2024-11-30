import * as z from "zod"

export const passwordSchema = z.object({
  current_password: z.string().min(1, "Current password is required"),
  new_password: z.string().min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, 
      "Password must contain at least one letter, one number, and one special character")
})

export const emailSchema = z.object({
  password: z.string().min(1, "Password is required"),
  new_email: z.string().email("Invalid email address")
})

export const financialSchema = z.object({
  income_per_month: z.number().positive("Income must be positive"),
  savings_per_month: z.number().min(0, "Savings cannot be negative"),
  yellow_threshold: z.number().positive("Threshold must be positive"),
  orange_threshold: z.number().positive("Threshold must be positive"),
  red_threshold: z.number().positive("Threshold must be positive")
})

export type PasswordFormValues = z.infer<typeof passwordSchema>
export type EmailFormValues = z.infer<typeof emailSchema>
export type FinancialFormValues = z.infer<typeof financialSchema>