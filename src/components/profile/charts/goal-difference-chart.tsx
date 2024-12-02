import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { format } from 'date-fns'
import { axisStyle, tooltipStyle, lineConfig } from './chart-config'
import type { Match } from '@/types'

interface GoalDifferenceChartProps {
  data: Array<{
    date: string
    difference: number
  }>
}

export function GoalDifferenceChart({ data }: GoalDifferenceChartProps) {
  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
          <XAxis
            dataKey="date"
            tickFormatter={(date) => format(new Date(date), 'MMM d')}
            {...axisStyle}
          />
          <YAxis {...axisStyle} />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(value: number) => [`${value > 0 ? '+' : ''}${value}`, 'Goal Difference']}
            labelFormatter={(date) => format(new Date(date), 'PPP')}
          />
          <Line
            type="monotone"
            dataKey="difference"
            stroke="hsl(var(--primary))"
            {...lineConfig}
            dot={{
              ...lineConfig.dot,
              fill: 'hsl(var(--primary))',
              stroke: 'hsl(var(--primary))',
            }}
            activeDot={{
              ...lineConfig.activeDot,
              fill: 'hsl(var(--primary))',
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
} 