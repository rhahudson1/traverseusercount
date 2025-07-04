import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import UserGrowthChart from "@/components/UserGrowthChart";
import MetricCard from "@/components/MetricCard";
import ProgressBarCard from "@/components/ProgressBarCard";
import { fetchAnalyticsData, DashboardData } from "@/services/analyticsService";
import { Skeleton } from "@/components/ui/skeleton";
import { LogOut, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['analytics'],
    queryFn: fetchAnalyticsData,
  });
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  if (error) {
    console.error('Failed to fetch analytics data:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-2">Error Loading Dashboard</h1>
          <p className="text-muted-foreground">Please check your connection and try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-center space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Traverse User Count Dashboard
            </h1>
            <p className="text-muted-foreground">
              Track Travere's user growth and engagement metrics
            </p>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <div className="text-sm text-muted-foreground">
              Last refreshed: {data?.lastRefreshed || 'Never'}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {isLoading ? (
            <>
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
            </>
          ) : (
            <>
              <MetricCard
                title="Total Users"
                value={data?.totalUsers || 0}
                period="All time"
              />
              <MetricCard
                title="Weekly Growth"
                value={data?.lastWeekUsers || 0}
                change={data && data.totalUsers ? Number(((data.lastWeekUsers / data.totalUsers) * 100).toFixed(2)) : 0}
                changeType="increase"
                period="Past 7 days"
              />
              <MetricCard
                title={`New Users Today`}
                value={data?.todayUsers || 0}
                change={data?.dailyGrowth || 0}
                changeType="increase"
                period="Today"
              />
              <ProgressBarCard
                title="10K Users Goal"
                current={data?.totalUsers || 0}
                target={10000}
              />
            </>
          )}
        </div>

        {/* Chart */}
        <div className="w-full">
          {isLoading ? (
            <div className="bg-card rounded-lg border p-6">
              <Skeleton className="h-6 w-48 mb-4" />
              <Skeleton className="h-80 w-full" />
            </div>
          ) : (
            <UserGrowthChart data={data?.chartData || []} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
