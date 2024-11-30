'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  LogOut, 
  User, 
  LayoutDashboard, 
  Wallet, 
  PiggyBank,
  Settings,
  Menu,
  ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { authService } from '@/lib/services/auth'
import { ThemeToggle } from "@/components/theme/theme-toggle"


export function SidebarNav() {
  const router = useRouter()
  const [isExpanded, setIsExpanded] = useState(false)

  const handleLogout = () => {
    authService.logout()
    router.push('/login')
  }

  return (
    <div
      className={cn(
        "fixed left-0 top-0 h-full bg-background border-r transition-all duration-300 ease-in-out flex flex-col",
        isExpanded ? "w-64" : "w-16"
      )}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="p-4 border-b flex items-center gap-4">
        {isExpanded ? (
          <span className="font-semibold">FinGuard</span>
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </div>
      
      <nav className="flex-1 p-2 space-y-2">
        <Link href="/dashboard" className={cn(
          "flex items-center gap-4 p-2 rounded-lg hover:bg-accent transition-colors",
          "text-sm font-medium",
          isExpanded ? "justify-start" : "justify-center"
        )}>
          <LayoutDashboard className="w-5 h-5" />
          {isExpanded && <span>Dashboard</span>}
        </Link>
        
        <Link href="/transactions" className={cn(
          "flex items-center gap-4 p-2 rounded-lg hover:bg-accent transition-colors",
          "text-sm font-medium",
          isExpanded ? "justify-start" : "justify-center"
        )}>
          <Wallet className="w-5 h-5" />
          {isExpanded && <span>Transactions</span>}
        </Link>
        
        <Link href="/category" className={cn(
          "flex items-center gap-4 p-2 rounded-lg hover:bg-accent transition-colors",
          "text-sm font-medium",
          isExpanded ? "justify-start" : "justify-center"
        )}>
          <PiggyBank className="w-5 h-5" />
          {isExpanded && <span>Categories</span>}
        </Link>
      </nav>
      <div className="p-2 border-t space-y-2">
        <Link href="/settings" className={cn(
          "flex items-center gap-4 p-2 rounded-lg hover:bg-accent transition-colors",
          "text-sm font-medium",
          isExpanded ? "justify-start" : "justify-center"
        )}>
          <Settings className="w-5 h-5" />
          {isExpanded && <span>Settings</span>}
        </Link>
        
        <div className={cn(
          "flex items-center gap-4 p-2",
          isExpanded ? "justify-start" : "justify-center"
        )}>
          <ThemeToggle />
        </div>
        
        <Button
          variant="ghost"
          className={cn(
            "w-full flex items-center gap-4 justify-center",
            isExpanded && "justify-start"
          )}
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
          {isExpanded && <span>Logout</span>}
        </Button>
      </div>
    </div>
  )
}