
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: number;
  change: number;
  changeType: "increase" | "decrease";
  period: string;
}

const MetricCard = ({ title, value, change, changeType, period }: MetricCardProps) => {
  const isPositive = changeType === "increase";
  
  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={`flex items-center space-x-1 text-xs ${
          isPositive ? "text-green-600" : "text-red-600"
        }`}>
          {isPositive ? (
            <ArrowUp className="h-3 w-3" />
          ) : (
            <ArrowDown className="h-3 w-3" />
          )}
          <span>{Math.abs(change)}%</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        <p className="text-xs text-muted-foreground mt-1">
          {period}
        </p>
      </CardContent>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600" />
    </Card>
  );
};

export default MetricCard;
