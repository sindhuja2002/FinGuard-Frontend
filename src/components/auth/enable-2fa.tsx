'use client'

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
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
import Image from "next/image"

const otpSchema = z.object({
  otp_code: z.string().length(6, "OTP must be 6 digits"),
})

export function Enable2FA() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [secret, setSecret] = useState<string | null>(null)
  const [step, setStep] = useState<'initial' | 'verify'>('initial')

  const form = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp_code: "",
    },
  })

  const initiate2FA = async () => {
    try {
      setIsLoading(true)
      const response = await authService.enable2FA()
      if (response) {
        setQrCode(response.qr_code)
        setSecret(response.secret)
        setStep('verify')
      } else {
        throw new Error("Failed to enable 2FA: No response data")
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.response?.data?.detail || error.message || "Failed to enable 2FA",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data: { otp_code: string }) => {
    try {
      setIsLoading(true)
      await authService.verify2FA(data.otp_code)
      toast({
        title: "Success",
        description: "2FA has been enabled successfully",
      })
      // Optionally redirect or update UI
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.response?.data?.detail || "Invalid OTP code",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (step === 'initial') {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-lg font-semibold">Enable Two-Factor Authentication</h2>
          <p className="text-sm text-muted-foreground">
            Secure your account with 2FA
          </p>
        </div>
        <Button 
          className="w-full" 
          onClick={initiate2FA} 
          disabled={isLoading}
        >
          {isLoading ? "Setting up..." : "Set up 2FA"}
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-lg font-semibold">Verify Two-Factor Authentication</h2>
        <p className="text-sm text-muted-foreground">
          Scan the QR code with your authenticator app
        </p>
      </div>

      {qrCode && (
        <div className="flex justify-center my-4">
          <Image
            src={`data:image/png;base64,${qrCode}`}
            alt="2FA QR Code"
            width={200}
            height={200}
          />
        </div>
      )}

      {secret && (
        <div className="text-center mb-4">
          <p className="text-sm font-medium">Manual entry code:</p>
          <code className="bg-muted p-2 rounded">{secret}</code>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="otp_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verification Code</FormLabel>
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
            {isLoading ? "Verifying..." : "Verify and Enable 2FA"}
          </Button>
        </form>
      </Form>
    </div>
  )
}