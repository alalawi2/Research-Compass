import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface BudgetCategory {
  name: string;
  amount: number;
}

interface BudgetChartProps {
  categories: BudgetCategory[];
  totalBudget: number;
}

const COLORS = ['#2563eb', '#16a34a', '#ea580c', '#9333ea', '#0891b2', '#dc2626', '#ca8a04', '#4f46e5'];

export function BudgetChart({ categories, totalBudget }: BudgetChartProps) {
  const pieData = categories.map((cat, idx) => ({
    name: cat.name,
    value: cat.amount,
    percentage: ((cat.amount / totalBudget) * 100).toFixed(1),
    fill: COLORS[idx % COLORS.length],
  }));

  const barData = categories
    .sort((a, b) => b.amount - a.amount)
    .map((cat, idx) => ({
      name: cat.name.length > 20 ? cat.name.substring(0, 17) + '...' : cat.name,
      amount: cat.amount,
      fill: COLORS[idx % COLORS.length],
    }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Distribution</CardTitle>
          <CardDescription>Percentage breakdown by category</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name}: ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Amount']}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>

          <div className="mt-4 text-center">
            <div className="text-sm text-muted-foreground">Total Budget</div>
            <div className="text-3xl font-bold text-primary">
              ${totalBudget.toLocaleString()}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Category Comparison</CardTitle>
          <CardDescription>Budget allocation by category</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={150} />
              <Tooltip 
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Amount']}
              />
              <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            <div className="p-2 bg-muted rounded text-center">
              <div className="text-muted-foreground">Largest Category</div>
              <div className="font-semibold">{categories[0]?.name || 'N/A'}</div>
              <div className="text-primary">${categories[0]?.amount.toLocaleString() || 0}</div>
            </div>
            <div className="p-2 bg-muted rounded text-center">
              <div className="text-muted-foreground">Categories</div>
              <div className="font-semibold text-2xl">{categories.length}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
