
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import UserGrowthChart from "@/components/UserGrowthChart";
import MetricCard from "@/components/MetricCard";
import { fetchAnalyticsData, DashboardData } from "@/services/analyticsService";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, TrendingUp, Calendar } from "lucide-react";

const Index = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['analytics'],
    queryFn: fetchAnalyticsData,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

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
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground">
            Track your app's user growth and engagement metrics
          </p>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isLoading ? (
            <>
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
            </>
          ) : (
            <>
              <MetricCard
                title="Total Users"
                value={data?.totalUsers || 0}
                change={data?.weeklyGrowth || 0}
                changeType="increase"
                period="All time"
              />
              <MetricCard
                title="Weekly Growth"
                value={Math.round((data?.weeklyGrowth || 0) * (data?.totalUsers || 0) / 100)}
                change={data?.weeklyGrowth || 0}
                changeType="increase"
                period="Past 7 days"
              />
              <MetricCard
                title="New Users Today"
                value={data?.todayUsers || 0}
                change={data?.dailyGrowth || 0}
                changeType="increase"
                period="Today"
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

        {/* Footer Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t">
          <div className="flex items-center space-x-3 p-4 bg-card rounded-lg border">
            <Users className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-sm text-muted-foreground">Active Users</p>
              <p className="text-lg font-semibold">{isLoading ? '...' : (data?.totalUsers || 0).toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-card rounded-lg border">
            <TrendingUp className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-sm text-muted-foreground">Growth Rate</p>
              <p className="text-lg font-semibold">{isLoading ? '...' : `+${data?.weeklyGrowth || 0}%`}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-card rounded-lg border">
            <Calendar className="h-8 w-8 text-purple-500" />
            <div>
              <p className="text-sm text-muted-foreground">Today's Signups</p>
              <p className="text-lg font-semibold">{isLoading ? '...' : (data?.todayUsers || 0)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
