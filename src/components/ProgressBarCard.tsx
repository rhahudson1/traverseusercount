import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ProgressBarCardProps {
  title: string;
  current: number;
  target: number;
  period?: string;
}

const ProgressBarCard = ({ title, current, target, period }: ProgressBarCardProps) => {
  const progress = Math.min((current / target) * 100, 100);
  const formattedCurrent = current.toLocaleString();
  const formattedTarget = target.toLocaleString();

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {period && (
          <span className="text-xs text-muted-foreground">{period}</span>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {formattedCurrent} / {formattedTarget}
        </div>
        <Progress 
          value={progress} 
          className="h-2 mt-2 bg-slate-200 dark:bg-slate-700 [&>div]:bg-gradient-to-r [&>div]:from-blue-600 [&>div]:to-purple-600"
        />
        <p className="text-xs text-muted-foreground mt-2">
          {progress.toFixed(2)}% of target reached
        </p>
      </CardContent>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600" />
    </Card>
  );
};

export default ProgressBarCard; 