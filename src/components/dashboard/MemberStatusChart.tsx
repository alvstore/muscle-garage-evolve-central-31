
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface MemberStatusChartProps {
  data: {
    name: string;
    value: number;
    color: string;
  }[];
}

const MemberStatusChart = ({ data }: MemberStatusChartProps) => {
  const total = data.reduce((acc, current) => acc + current.value, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Member Status</CardTitle>
        <CardDescription>Distribution of member status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                  const radius = innerRadius + (outerRadius - innerRadius) * 1.3;
                  const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                  const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                  return (
                    <text 
                      x={x} 
                      y={y} 
                      fill="#888" 
                      textAnchor={x > cx ? "start" : "end"} 
                      dominantBaseline="central"
                      fontSize="12"
                    >
                      {`${(percent * 100).toFixed(0)}%`}
                    </text>
                  );
                }}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend 
                layout="horizontal" 
                verticalAlign="bottom" 
                align="center" 
                iconType="circle"
                formatter={(value, entry, index) => {
                  // Calculate the percentage
                  const item = data[index!];
                  const percentage = ((item.value / total) * 100).toFixed(1);
                  return <span style={{ color: "#666", fontSize: 12 }}>{value} ({percentage}%)</span>;
                }}
              />
              <Tooltip 
                formatter={(value, name) => [`${value} members`, name]}
                contentStyle={{ backgroundColor: 'white', borderRadius: '4px', border: '1px solid #ddd' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default MemberStatusChart;
