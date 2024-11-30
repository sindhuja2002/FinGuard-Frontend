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
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import { transactionService, Transaction } from '@/lib/services/transaction'
import { categoryService, Category } from '@/lib/services/category'
import { EditTransactionDialog } from './edit-transaction-dialog'
import { DeleteTransactionDialog } from './delete-transaction-dialog'
import { Skeleton } from "@/components/ui/skeleton"
import Link from 'next/link'

export function RecentTransactions() {
  const [mounted, setMounted] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<Category[]>([])
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
        sort_by: 'transaction_date',
        order: 'desc'
      })
      const recentTransactions = data.slice(0, 5) // Only take first 5 transactions
      setTransactions(recentTransactions)
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
  }, [])

  if (!mounted) return null
  if (isLoading) return <Skeleton className="h-[300px] w-full" />

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Recent Transactions</h2>
        <Button variant="outline" asChild>
          <Link href="/transactions">View All</Link>
        </Button>
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

      {editTransaction && (
        <EditTransactionDialog
          transaction={editTransaction}
          categories={categories}
          open={!!editTransaction}
          onOpenChange={(open) => !open && setEditTransaction(null)}
          onSuccess={fetchTransactions}
        />
      )}

      {deleteTransaction && (
        <DeleteTransactionDialog
          transaction={deleteTransaction}
          open={!!deleteTransaction}
          onOpenChange={(open) => !open && setDeleteTransaction(null)}
          onSuccess={fetchTransactions}
        />
      )}
    </div>
  )
}