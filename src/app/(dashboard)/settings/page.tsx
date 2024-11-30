'use client'

import { useState } from "react"
import { PasswordForm } from "@/components/settings/password-form"
import { EmailForm } from "@/components/settings/email-form"
import { FinancialForm } from "@/components/settings/financial-form"
import { UserInfoCard } from "@/components/settings/user-info-card"
import { TwoFactorSettings } from "@/components/settings/two-factor-settings"
import { WishlistSettings } from "@/components/settings/wishlist-settings"

export default function SettingsPage() {
  return (
    <div className="grid gap-4">
      <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
      <div className="grid gap-6">
        <UserInfoCard />
        <PasswordForm />
        <TwoFactorSettings/>
        <EmailForm />
        <FinancialForm />
        <WishlistSettings/>
      </div>
    </div>
  )
}