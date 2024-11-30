import { Enable2FA } from "@/components/auth/enable-2fa"

export default function TwoFactorAuthPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <Enable2FA />
      </div>
    </div>
  )
}