'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { TransactionsTable } from '@/components/transaction/transaction-table'
import { CreateTransactionDialog } from '@/components/transaction/create-transaction-dialog'
import { categoryService, Category } from '@/lib/services/category'

export default function TransactionsPage() {
  const [mounted, setMounted] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    setMounted(true)
    const fetchCategories = async () => {
      const data = await categoryService.getCategories()
      setCategories(data)
    }
    fetchCategories()
  }, [])

  if (!mounted) {
    return null
  }


  const handleTransactionsChange = () => {
    // Find the TransactionsTable component and trigger refresh
    const transactionsTableRef = document.querySelector('[data-testid="transactions-table"]')
    if (transactionsTableRef) {
      transactionsTableRef.dispatchEvent(new CustomEvent('refresh-transactions'))
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Transaction
        </Button>
      </div>

      <TransactionsTable onTransactionsChange={handleTransactionsChange} />
      
      <CreateTransactionDialog 
        categories={categories}
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={handleTransactionsChange}
      />
    </div>
  )
}