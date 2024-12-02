export const axisStyle = {
  fontSize: 12,
  fontFamily: "inherit",
  fill: "currentColor",
  dy: 8
}

export const tooltipStyle = {
  backgroundColor: "hsl(var(--background))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "var(--radius)",
  fontSize: "12px",
  padding: "8px 12px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
}

export const lineConfig = {
  strokeWidth: 2,
  dot: {
    r: 4,
    strokeWidth: 2
  },
  activeDot: {
    r: 6,
    strokeWidth: 2,
    stroke: "hsl(var(--background))"
  }
}

export const chartColors = {
  wins: "hsl(var(--success))",
  losses: "hsl(var(--destructive))",
  total: "hsl(var(--primary))"
}