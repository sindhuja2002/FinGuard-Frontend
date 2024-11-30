import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { otpSchema } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/lib/services/auth";
import Image from "next/image";

export function TwoFactorSettings() {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      code: "",
    },
  });

  const enable2FA = async () => {
    try {
      setIsLoading(true);
      const response = await authService.enable2FA();
      if (response && response.qr_code) {
        setQrCode(response.qr_code);
      } else {
        throw new Error("Failed to retrieve QR code");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to enable 2FA",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchOtpStatus = async () => {
      try {
        const response = await authService.getOtpStatus();
        setIsEnabled(response.otp_enabled);
      } catch (error) {
        console.error("Failed to fetch OTP status:", error);
      }
    };

    fetchOtpStatus();
  }, []);

  const onSubmit = async (data: { code: string }) => {
    try {
      setIsLoading(true);
      if (isEnabled) {
        await authService.disable2FA(data.code);
        setIsEnabled(false);
        toast({
          title: "Success",
          description: "2FA has been disabled",
        });
      } else {
        await authService.verify2FA(data.code);
        setIsEnabled(true);
        setQrCode(null);
        toast({
          title: "Success",
          description: "2FA has been enabled",
        });
      }
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Invalid OTP code",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Two-Factor Authentication</CardTitle>
        <CardDescription>
          Add an extra layer of security to your account using an authenticator app
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isEnabled && !qrCode && (
          <Button onClick={enable2FA} disabled={isLoading}>
            Enable 2FA
          </Button>
        )}

        {qrCode && (
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">
                1. Scan this QR code with your authenticator app
              </p>
              <div className="bg-white p-4 w-fit rounded-lg">
                <Image
                  src={`data:image/png;base64,${qrCode}`}
                  alt="QR Code"
                  width={200}
                  height={200}
                />
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">
                2. Enter the verification code from your app
              </p>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            type="text"
                            maxLength={6}
                            placeholder="Enter 6-digit code"
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isLoading}>
                    Verify and Enable
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        )}

        {isEnabled && (
          <div className="space-y-4">
            <p className="text-sm">Two-factor authentication is enabled</p>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Enter OTP to disable 2FA</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          maxLength={6}
                          placeholder="Enter 6-digit code"
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" variant="destructive" disabled={isLoading}>
                  Disable 2FA
                </Button>
              </form>
            </Form>
          </div>
        )}
      </CardContent>
    </Card>
  );
}