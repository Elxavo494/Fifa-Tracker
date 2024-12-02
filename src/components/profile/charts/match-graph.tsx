import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts';
import { useMatchData } from './use-match-data';
import type { Match } from '@/types';

interface MatchGraphProps {
  matches: Match[];
  userId: string;
}

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
    color: string;
  }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload) return null;

  return (
    <div className="rounded-lg border bg-background p-2 shadow-sm">
      <p className="font-medium">{label}</p>
      {payload.map((item, index) => (
        <p key={index} className="text-sm" style={{ color: item.color }}>
          {item.dataKey}: {item.value}
        </p>
      ))}
    </div>
  );
}

export function MatchGraph({ matches, userId }: MatchGraphProps) {
  const data = useMatchData(matches, userId);

  return (
    <div className="h-100 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="date"
            stroke="currentColor"
            fontSize={12}
            tickLine={{ stroke: 'currentColor' }}
            axisLine={{ stroke: 'currentColor' }}
          />
          <YAxis
            width={60}
            tickSize={8}
            tickMargin={4}
            stroke="currentColor"
            fontSize={12}
            tickLine={{ stroke: 'currentColor' }}
            axisLine={{ stroke: 'currentColor' }}
            allowDecimals={false}
            domain={[0, 'auto']}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="wins"
            stroke="hsl(var(--success))"
            strokeWidth={2}
            dot={{
              r: 4,
              strokeWidth: 2,
              fill: 'hsl(var(--success))',
              stroke: 'hsl(var(--success))',
            }}
            activeDot={{
              r: 6,
              strokeWidth: 2,
              fill: 'hsl(var(--success))',
              stroke: 'hsl(var(--background))',
            }}
            name="Wins"
          />
          <Line
            type="monotone"
            dataKey="losses"
            stroke="hsl(var(--destructive))"
            strokeWidth={2}
            dot={{
              r: 4,
              strokeWidth: 2,
              fill: 'hsl(var(--destructive))',
              stroke: 'hsl(var(--destructive))',
            }}
            activeDot={{
              r: 6,
              strokeWidth: 2,
              fill: 'hsl(var(--destructive))',
              stroke: 'hsl(var(--background))',
            }}
            name="Losses"
          />
          <Line
            type="monotone"
            dataKey="total"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={{
              r: 4,
              strokeWidth: 2,
              fill: 'hsl(var(--primary))',
              stroke: 'hsl(var(--primary))',
            }}
            activeDot={{
              r: 6,
              strokeWidth: 2,
              fill: 'hsl(var(--primary))',
              stroke: 'hsl(var(--background))',
            }}
            name="Total Matches"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
