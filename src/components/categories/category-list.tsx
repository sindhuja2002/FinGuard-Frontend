'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2 } from 'lucide-react'
import { EditCategoryDialog } from './edit-category-dialog'
import { DeleteCategoryDialog } from './delete-category-dialog'
import { Category } from '@/lib/services/category'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCurrency } from '@/lib/utils'
import { 
  ShoppingBag, Car, Home, Utensils, Coffee,
  Film, Book, Gift, Heart, Music,
  Plane, Gamepad, Shirt, Dumbbell, Stethoscope,
  LucideIcon
} from 'lucide-react'

interface CategoryListProps {
  categories: Category[]
  isLoading: boolean
  onCategoriesChange: () => void
}
const ICONS: { [key: string]: LucideIcon } = {
  'shopping-bag': ShoppingBag,
  'car': Car,
  'home': Home,
  'utensils': Utensils,
  'coffee': Coffee,
  'film': Film,
  'book': Book,
  'gift': Gift,
  'heart': Heart,
  'music': Music,
  'plane': Plane,
  'gamepad': Gamepad,
  'shirt': Shirt,
  'dumbbell': Dumbbell,
  'medical': Stethoscope,
}

export function CategoryList({ categories, isLoading, onCategoriesChange }: CategoryListProps) {
  const [editCategory, setEditCategory] = useState<Category | null>(null)
  const [deleteCategory, setDeleteCategory] = useState<Category | null>(null)


  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, index) => (
          <Card key={`skeleton-${index}`}>
            <CardHeader>
              <Skeleton className="h-4 w-[150px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-[200px]" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!categories?.length) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">No categories found. Create your first category!</p>
      </Card>
    )
  }

  return (
    <>
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <Card 
          key={category._id}
          className="relative overflow-hidden"
          style={{ borderColor: category.color }}
        >
          <div 
            className="absolute top-0 right-0 w-2 h-full" 
            style={{ backgroundColor: category.color }}
          />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              {(() => {
                const IconComponent = ICONS[category.icon] || ShoppingBag
                return <IconComponent size={16} color={category.color} />
              })()}
              {category.name}
            </CardTitle>
            <div className="space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setEditCategory(category)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDeleteCategory(category)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              {category.description}
            </p>
            <div className="flex justify-between items-center text-sm">
              <span>Budget:</span>
              <span className="font-medium">{formatCurrency(category.budget)}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

      {editCategory && (
        <EditCategoryDialog
          category={editCategory}
          open={!!editCategory}
          onOpenChange={(open) => !open && setEditCategory(null)}
          onSuccess={onCategoriesChange}
        />
      )}

      {deleteCategory && (
        <DeleteCategoryDialog
          category={deleteCategory}
          open={!!deleteCategory}
          onOpenChange={(open) => !open && setDeleteCategory(null)}
          onSuccess={onCategoriesChange}
        />
      )}
    </>
  )
}