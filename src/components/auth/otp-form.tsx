'use client'

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { z } from "zod"
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
import { authService } from "@/lib/services/auth"

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
})

export function OTPForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  })

  const onSubmit = async (data: { otp: string }) => {
    try {
      setIsLoading(true)
      const loginData = JSON.parse(sessionStorage.getItem('tempLoginData') || '{}')
      
      const response = await authService.verifyLoginOTP(
        loginData.email,
        loginData.password,
        data.otp
      )

      // Clear temporary login data
      sessionStorage.removeItem('tempLoginData')
      
      // Store the token
      localStorage.setItem('token', response.access_token)
      
      toast({
        title: "Success",
        description: "Logged in successfully",
      })
      router.push("/dashboard")
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.response?.data?.detail || "Invalid OTP",
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
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading ? "Verifying..." : "Verify"}
        </Button>
      </form>
    </Form>
  )
}