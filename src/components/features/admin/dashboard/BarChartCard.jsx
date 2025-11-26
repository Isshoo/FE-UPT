import { Card } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function BarChartCard({
  title,
  data,
  dataKey,
  xAxisKey,
  color = '#fba635',
  height = 300,
}) {
  return (
    <Card className="gap-6 p-4">
      <h3 className="text-sm font-semibold">{title}</h3>
      <ResponsiveContainer width="90%" height={height}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis dataKey={xAxisKey} tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey={dataKey} fill={color} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
