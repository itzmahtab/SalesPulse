// components/reports/TopProductsChart.tsx
'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface ChartData {
  name: string;
  qty: number;
  revenue: number;
}

interface TopProductsChartProps {
  data: ChartData[];
}

export function TopProductsChart({ data }: TopProductsChartProps) {
  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={data} 
          layout="vertical"
          margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
          <XAxis 
            type="number" 
            stroke="#71717a" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `৳${v >= 1000 ? `${(v/1000).toFixed(1)}k` : v}`}
          />
          <YAxis 
            type="category" 
            dataKey="name" 
            stroke="#71717a" 
            fontSize={12}
            width={120}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#18181b',
              border: '1px solid #27272a',
              borderRadius: '8px',
              color: '#fafafa',
            }}
            formatter={(value, name) => {
              const numValue = Number(value);
              if (name === 'revenue') return [`৳${numValue.toLocaleString()}`, 'Revenue'];
              return [numValue, 'Quantity'];
            }}
          />
          <Bar dataKey="revenue" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={`hsl(239, 84%, ${60 - index * 8}%)`} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
