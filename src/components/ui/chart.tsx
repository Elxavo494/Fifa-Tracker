// import * as React from 'react';
// import * as RechartsPrimitive from 'recharts';
// import { cn } from '@/lib/utils';

// // Format: { THEME_NAME: CSS_SELECTOR }
// const THEMES = { light: '', dark: '.dark' } as const;

// export type ChartConfig = {
//   [k in string]: {
//     label?: React.ReactNode;
//     icon?: React.ComponentType;
//   } & (
//     | { color?: string; theme?: never }
//     | { color?: never; theme: Record<keyof typeof THEMES, string> }
//   );
// };

// type ChartContextProps = {
//   config: ChartConfig;
// };

// const ChartContext = React.createContext<ChartContextProps | null>(null);

// function useChart() {
//   const context = React.useContext(ChartContext);

//   if (!context) {
//     throw new Error('useChart must be used within a <ChartContainer />');
//   }

//   return context;
// }

// const ChartContainer = React.forwardRef<
//   HTMLDivElement,
//   React.ComponentProps<'div'> & {
//     config: ChartConfig;
//     children: React.ComponentProps<
//       typeof RechartsPrimitive.ResponsiveContainer
//     >['children'];
//   }
// >(({ id, className, children, config, ...props }, ref) => {
//   const uniqueId = React.useId();
//   const chartId = `chart-${id || uniqueId.replace(/:/g, '')}`;

//   return (
//     <ChartContext.Provider value={{ config }}>
//       <div
//         data-chart={chartId}
//         ref={ref}
//         className={cn(
//           "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
//           className
//         )}
//         {...props}
//       >
//         <ChartStyle id={chartId} config={config} />
//         <RechartsPrimitive.ResponsiveContainer>
//           {children}
//         </RechartsPrimitive.ResponsiveContainer>
//       </div>
//     </ChartContext.Provider>
//   );
// });
// ChartContainer.displayName = 'Chart';

// const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
//   const colorConfig = Object.entries(config).filter(
//     ([_, config]) => config.theme || config.color
//   );

//   if (!colorConfig.length) {
//     return null;
//   }

//   return (
//     <style
//       dangerouslySetInnerHTML={{
//         __html: Object.entries(THEMES)
//           .map(
//             ([theme, prefix]) => `
// ${prefix} [data-chart=${id}] {
// ${colorConfig
//   .map(([key, itemConfig]) => {
//     const color =
//       itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
//       itemConfig.color;
//     return color ? `  --color-${key}: ${color};` : null;
//   })
//   .join('\n')}
// }
// `
//           )
//           .join('\n'),
//       }}
//     />
//   );
// };

// const ChartTooltip = RechartsPrimitive.Tooltip;

// // 1. Improve type safety for payload
// type ChartPayload = {
//   dataKey?: string;
//   payload?: Record<string, any>;
//   color?: string;
//   value?: number;
//   name?: string;
// };

// // 2. Optimize ChartTooltipContent with useMemo
// const ChartTooltipContent = React.forwardRef<
//   HTMLDivElement,
//   RechartsPrimitive.TooltipProps<number, string>
// >(
//   (props, ref) => {
//     const { config } = useChart();
    
//     const processedPayload = React.useMemo(() => {
//       if (!props.active || !props.payload?.length) {
//         return null;
//       }
//       return props.payload;
//     }, [props.active, props.payload]);

//     if (!processedPayload) {
//       return null;
//     }

//     return (
//       <div
//         ref={ref}
//         className="rounded-lg border bg-background px-3 py-2 text-sm shadow-md"
//       >
//         {processedPayload.map((item: ChartPayload, index: number) => {
//           const key = item.dataKey || 'value';
//           const itemConfig = getPayloadConfigFromPayload(config, item, key);

//           return (
//             <div key={index} className="flex items-center gap-2">
//               <div
//                 className="h-2 w-2 rounded-[2px]"
//                 style={{ backgroundColor: item.color }}
//               />
//               <span className="text-muted-foreground">
//                 {itemConfig?.label || item.name}:
//               </span>{' '}
//               {item.value}
//             </div>
//           );
//         })}
//       </div>
//     );
//   }
// );
// ChartTooltipContent.displayName = 'ChartTooltip';

// const ChartLegend = RechartsPrimitive.Legend;

// const ChartLegendContent = React.forwardRef<
//   HTMLDivElement,
//   React.ComponentProps<'div'> &
//     Pick<RechartsPrimitive.LegendProps, 'payload' | 'verticalAlign'> & {
//       hideIcon?: boolean;
//       nameKey?: string;
//     }
// >(
//   (
//     { className, hideIcon = false, payload, verticalAlign = 'bottom', nameKey },
//     ref
//   ) => {
//     const { config } = useChart();

//     if (!payload?.length) {
//       return null;
//     }

//     return (
//       <div
//         ref={ref}
//         className={cn(
//           'flex items-center justify-center gap-4',
//           verticalAlign === 'top' ? 'pb-3' : 'pt-3',
//           className
//         )}
//       >
//         {payload.map((item) => {
//           const key = `${nameKey || item.dataKey || 'value'}`;
//           const itemConfig = getPayloadConfigFromPayload(config, item, key);

//           return (
//             <div
//               key={item.value}
//               className={cn(
//                 'flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground'
//               )}
//             >
//               {itemConfig?.icon && !hideIcon ? (
//                 <itemConfig.icon />
//               ) : (
//                 <div
//                   className="h-2 w-2 shrink-0 rounded-[2px]"
//                   style={{
//                     backgroundColor: item.color,
//                   }}
//                 />
//               )}
//               {itemConfig?.label}
//             </div>
//           );
//         })}
//       </div>
//     );
//   }
// );
// ChartLegendContent.displayName = 'ChartLegend';

// // 3. Improve error handling in getPayloadConfigFromPayload
// function getPayloadConfigFromPayload(
//   config: ChartConfig,
//   payload: ChartPayload,
//   key: string
// ): ChartConfig[keyof ChartConfig] | undefined {
//   try {
//     const payloadPayload = payload.payload;
//     let configLabelKey: string = key;

//     if (key in payload && typeof payload[key as keyof ChartPayload] === 'string') {
//       configLabelKey = payload[key as keyof ChartPayload] as string;
//     } else if (
//       payloadPayload &&
//       key in payloadPayload &&
//       typeof payloadPayload[key] === 'string'
//     ) {
//       configLabelKey = payloadPayload[key];
//     }

//     return config[configLabelKey];
//   } catch (error) {
//     console.warn('Error processing chart payload:', error);
//     return undefined;
//   }
// }

// export {
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent,
//   ChartLegend,
//   ChartLegendContent,
//   ChartStyle,
// };
