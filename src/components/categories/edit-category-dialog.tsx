'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { Category, categoryService } from '@/lib/services/category'
import { ColorPicker } from './color-picker'
import { IconSelector } from './icon-picker'


interface EditCategoryDialogProps {
  category: Category | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function EditCategoryDialog({ 
    category,
    open, 
    onOpenChange,
    onSuccess 
  }: EditCategoryDialogProps) {
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
      name: '',
      description: '',
      budget: 0,
      color: '#000000',
      icon: 'default'
    })
  
    useEffect(() => {
      if (category) {
        setFormData({
          name: category.name,
          description: category.description || '',
          budget: category.budget || 0,
          color: category.color || '#000000',
          icon: category.icon || 'default'
        })
      }
    }, [category])
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      if (!category) return
  
      setIsLoading(true)
      try {
        await categoryService.updateCategory(category._id, formData)
        toast({ title: "Category updated successfully" })
        onSuccess()
        onOpenChange(false)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update category",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
  

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="budget">Budget</Label>
            <Input
              id="budget"
              type="number"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="color">Color</Label>
            <ColorPicker
              value={formData.color}
              onChange={(color) => setFormData({ ...formData, color })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="icon">Icon</Label>
            <IconSelector
              value={formData.icon}
              onChange={(icon) => setFormData({ ...formData, icon })}
              color={formData.color}
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}