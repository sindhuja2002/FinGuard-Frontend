import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

interface AnalyticsData {
  id: string
  user_id: string
  category_expenses: Record<string, number>
  total_expenses: number
  budget_vs_actual: Record<string, any>
  alerts: any[]
}

interface AnalyticsChartsProps {
  data: AnalyticsData
  categories: Array<{ _id: string; name: string }>
}

export function AnalyticsCharts({ data, categories }: AnalyticsChartsProps) {
  // Transform data for pie chart
  const pieData = Object.entries(data.category_expenses).map(([categoryId, value]) => ({
    name: categories.find(c => c._id === categoryId)?.name || 'Unknown',
    value
  }))

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Spending Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}