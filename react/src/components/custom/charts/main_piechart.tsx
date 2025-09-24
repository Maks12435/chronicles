import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

const COLORS = ["#1e90ff", "#111"]; 

export default function MainPieChart({ percentage, size }: { percentage: number, size: number }) {
  const pct = Math.max(0, Math.min(100, Math.round(percentage)));

  const data = [
    { name: "progress", value: pct },
    { name: "rest", value: 100 - pct },
  ];

  return (
    <div className={`relative w-full`} style={{ height: `${size}rem` }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
            innerRadius="80%"
            outerRadius="100%"
            stroke="none"
            data-testid="main-pie"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <div className="font-bold text-[#1e90ff]" style={{ fontSize: `${size/5}rem` }}>{`${pct}%`}</div>
        </div>
      </div>
    </div>
  );
}
