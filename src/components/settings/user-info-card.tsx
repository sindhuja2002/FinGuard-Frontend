'use client'

import { useEffect, useState } from "react"
import { authService } from "@/lib/services/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface UserInfo {
  username: string
  full_name: string
  email: string
}

export function UserInfoCard() {
  const [user, setUser] = useState<UserInfo | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await authService.me()
        setUser(userData)
      } catch (error) {
        console.error('Failed to fetch user data:', error)
      }
    }
    fetchUser()
  }, [])

  if (!user) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Information</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Username</p>
          <p className="text-lg font-medium">{user.username}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Full Name</p>
          <p className="text-lg font-medium">{user.full_name}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Email</p>
          <p className="text-lg font-medium">{user.email}</p>
        </div>
      </CardContent>
    </Card>
  )
}