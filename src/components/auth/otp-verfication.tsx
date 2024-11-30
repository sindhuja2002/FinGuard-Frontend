'use client'

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { authService } from "@/lib/services/auth"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
})

export function OTPVerification() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  
  const form = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  })

  useEffect(() => {
    // Check if we have login data
    const loginData = sessionStorage.getItem('tempLoginData')
    if (!loginData) {
      router.push('/login')
    }
  }, [router])

  // In OTPVerification component
const onSubmit = async (data: { otp: string }) => {
    try {
      setIsLoading(true)
      const loginData = JSON.parse(sessionStorage.getItem('tempLoginData') || '{}')
      
      await authService.verifyLoginOTP(
        loginData.email,
        loginData.password,
        data.otp
      )
  
      sessionStorage.removeItem('tempLoginData')
      
      toast({
        title: "Success",
        description: "Logged in successfully",
      })
      router.push("/dashboard")
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: typeof error?.response?.data?.detail === 'string' 
          ? error.response.data.detail 
          : "Invalid OTP",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="otp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Authentication Code</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  pattern="\d{6}"
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading ? "Verifying..." : "Verify OTP"}
        </Button>
      </form>
    </Form>
  )
}