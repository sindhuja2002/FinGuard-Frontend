import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"

interface AnalyticsCardsProps {
  totalExpenses: number
  categoryExpenses: Record<string, number>
  categories: Array<{ _id: string; name: string }>
}

export function AnalyticsCards({ totalExpenses, categoryExpenses, categories }: AnalyticsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
        </CardContent>
      </Card>

      {Object.entries(categoryExpenses).map(([categoryId, amount]) => {
        const category = categories.find(c => c._id === categoryId)
        if (!category) return null

        return (
          <Card key={categoryId}>
            <CardHeader>
              <CardTitle className="text-sm font-medium">{category.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(amount)}</div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}