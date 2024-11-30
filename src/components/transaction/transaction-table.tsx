'use client'

import { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import { transactionService, Transaction } from '@/lib/services/transaction'
import { categoryService, Category } from '@/lib/services/category'
import { EditTransactionDialog } from './edit-transaction-dialog'
import { DeleteTransactionDialog } from './delete-transaction-dialog'
import { Skeleton } from "@/components/ui/skeleton"

interface TransactionsTableProps {
  onTransactionsChange: () => void
}

export function TransactionsTable({ onTransactionsChange }: TransactionsTableProps) {
    const [mounted, setMounted] = useState(false)
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [selectedCategory, setSelectedCategory] = useState<string>('all')
    const [editTransaction, setEditTransaction] = useState<Transaction | null>(null)
    const [deleteTransaction, setDeleteTransaction] = useState<Transaction | null>(null)
    const [isLoading, setIsLoading] = useState(true)
  
    useEffect(() => {
      setMounted(true)
    }, [])
  

  const fetchTransactions = async () => {
    try {
      setIsLoading(true)
      const data = await transactionService.getTransactions({
        category_id: selectedCategory === 'all' ? undefined : selectedCategory,
        sort_by: 'transaction_date',
        order: 'desc'
      })
      setTransactions(data)
    } catch (error) {
      console.error('Failed to fetch transactions:', error)
    } finally {
      setIsLoading(false)
    }
  }
    
  const refreshTransactions = async () => {
    try {
      setIsLoading(true)
      const data = await transactionService.getTransactions({
        category_id: selectedCategory === 'all' ? undefined : selectedCategory,
        sort_by: 'transaction_date',
        order: 'desc'
      })
      setTransactions(data) // Add this line to update the transactions state
    } catch (error) {
      console.error('Failed to fetch transactions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await categoryService.getCategories()
      setCategories(data)
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchTransactions()
  }, [selectedCategory])

  useEffect(() => {
    const handleRefresh = () => {
      refreshTransactions()
    }
  
    const tableElement = document.querySelector('[data-testid="transactions-table"]')
    if (tableElement) {
      tableElement.addEventListener('refresh-transactions', handleRefresh)
    }
  
    return () => {
      if (tableElement) {
        tableElement.removeEventListener('refresh-transactions', handleRefresh)
      }
    }
  }, [])
  
  // Add data-testid to the root div

    
  const handleTransactionChange = () => {
    refreshTransactions()
    onTransactionsChange()
  }
    

  if (!mounted) {
    return null
  }

  if (isLoading) {
    return <Skeleton className="h-[400px] w-full" />
  }

  return (
    <>
        <div data-testid="transactions-table" className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Recent Transactions</h2>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
  <SelectItem value="all">All Categories</SelectItem>
  {categories.map((category) => (
    <SelectItem key={category._id} value={category._id}>
      {category.name}
    </SelectItem>
  ))}
</SelectContent>
          </Select>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction._id}>
                <TableCell>
                  {new Date(transaction.transaction_date).toLocaleDateString()}
                </TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>
                  {categories.find(c => c._id === transaction.category_id)?.name}
                </TableCell>
                <TableCell className="text-right">
                  ${transaction.amount.toFixed(2)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditTransaction(transaction)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteTransaction(transaction)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {editTransaction && (
        <EditTransactionDialog
          transaction={editTransaction}
          categories={categories}
          open={!!editTransaction}
          onOpenChange={(open) => !open && setEditTransaction(null)}
          onSuccess={handleTransactionChange}
        />
      )}

      {deleteTransaction && (
        <DeleteTransactionDialog
          transaction={deleteTransaction}
          open={!!deleteTransaction}
          onOpenChange={(open) => !open && setDeleteTransaction(null)}
          onSuccess={handleTransactionChange}
        />
      )}
    </>
  )
}