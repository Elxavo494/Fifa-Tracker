import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useState } from 'react';
import { subDays } from 'date-fns';
import { DateRangeSelector } from './charts/date-range-selector';
import { useMatchData } from './charts/use-match-data';
import {
  axisStyle,
  tooltipStyle,
  lineConfig,
  chartColors,
} from './charts/chart-config';
import type { Match } from '@/types';
import type { DateRange } from 'react-day-picker';

interface MatchGraphProps {
  matches: Match[];
  userId: string;
}

export function MatchGraph({ matches, userId }: MatchGraphProps) {
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const to = new Date();
    const from = subDays(to, 7);
    return { from, to };
  });

  const data = useMatchData(matches, userId, dateRange);

  return (
    <div className={`space-y-4 -mt-[40px] flex flex-col justify-between h-full`}>
      <div className="flex justify-end">
        <DateRangeSelector
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />
      </div>
      <div className="h-[250px] md:h-[450px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
              dataKey="date"
              tick={{ ...axisStyle }}
              axisLine={{ stroke: 'currentColor' }}
              tickLine={{ stroke: 'currentColor' }}
            />
            <YAxis
              tick={{ ...axisStyle }}
              axisLine={{ stroke: 'currentColor' }}
              tickLine={{ stroke: 'currentColor' }}
              allowDecimals={false}
              domain={[0, 'auto']}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              cursor={{ stroke: 'currentColor', strokeWidth: 1 }}
            />
            <Line
              type="monotone"
              dataKey="wins"
              stroke={chartColors.wins}
              dot={{ ...lineConfig.dot, fill: chartColors.wins }}
              activeDot={{ ...lineConfig.activeDot, fill: chartColors.wins }}
              strokeWidth={lineConfig.strokeWidth}
              name="Wins"
            />
            <Line
              type="monotone"
              dataKey="losses"
              stroke={chartColors.losses}
              dot={{ ...lineConfig.dot, fill: chartColors.losses }}
              activeDot={{ ...lineConfig.activeDot, fill: chartColors.losses }}
              strokeWidth={lineConfig.strokeWidth}
              name="Losses"
            />
            <Line
              type="monotone"
              dataKey="total"
              stroke={chartColors.total}
              dot={{ ...lineConfig.dot, fill: chartColors.total }}
              activeDot={{ ...lineConfig.activeDot, fill: chartColors.total }}
              strokeWidth={lineConfig.strokeWidth}
              name="Total Matches"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
