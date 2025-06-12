import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firestore';

// This is a mock service - replace with your actual Firebase integration
export interface DashboardData {
  weeklyGrowth: number;
  dailyGrowth: number;
  totalUsers: number;
  todayUsers: number;
  chartData: Array<{ date: string; users: number }>;
  lastRefreshed: string;
}

const getDateRange = (days: number) => {
  const end = new Date();
  end.setHours(23, 59, 59, 999); // End of the current day
  const start = new Date();
  start.setDate(start.getDate() - days);
  start.setHours(0, 0, 0, 0); // Start of the day
  return { start, end };
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const fetchAnalyticsData = async (): Promise<DashboardData> => {
  console.log("Starting analytics data fetch...");
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, orderBy('createdAt', 'desc'));
    console.log("Querying Firestore for users...");
    const snapshot = await getDocs(q);
    console.log(`Retrieved ${snapshot.docs.length} users from Firestore`);
    
    const users = snapshot.docs.map(doc => ({
      id: doc.id,
      createdAt: new Date(doc.data().createdAt)
    }));
    console.log("Processed user data with creation dates");
    console.log("User creation dates:", users.map(u => u.createdAt.toISOString()));

    const totalUsers = users.length;
    console.log(`Total users: ${totalUsers}`);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    console.log(`Today's date range: ${today.toISOString()} to ${tomorrow.toISOString()}`);

    const todayUsers = users.filter(user => 
      user.createdAt >= today && user.createdAt < tomorrow
    ).length;
    console.log(`Users created today: ${todayUsers}`);

    const { start: weekStart, end: weekEnd } = getDateRange(7);
    console.log(`Weekly date range: ${weekStart.toISOString()} to ${weekEnd.toISOString()}`);

    const lastWeekUsers = users.filter(user => {
      const isInRange = user.createdAt >= weekStart && user.createdAt <= weekEnd;
      console.log(`User ${user.id} created at ${user.createdAt.toISOString()} - In weekly range: ${isInRange}`);
      return isInRange;
    }).length;
    console.log(`Users created in the last week: ${lastWeekUsers}`);

    // Get users from previous week for comparison
    const previousWeekStart = new Date(weekStart);
    previousWeekStart.setDate(previousWeekStart.getDate() - 7);
    const previousWeekEnd = new Date(weekStart);
    console.log(`Previous week range: ${previousWeekStart.toISOString()} to ${previousWeekEnd.toISOString()}`);

    const previousWeekUsers = users.filter(user =>
      user.createdAt >= previousWeekStart && user.createdAt < previousWeekEnd
    ).length;
    console.log(`Users created in the previous week: ${previousWeekUsers}`);

    // Calculate growth rate as percentage change from previous week
    const weeklyGrowth = previousWeekUsers > 0 
      ? Number(((lastWeekUsers - previousWeekUsers) / previousWeekUsers * 100).toFixed(2))
      : lastWeekUsers > 0 ? 100 : 0;
    const dailyGrowth = todayUsers > 0 
      ? Number((todayUsers / totalUsers * 100).toFixed(2))
      : 0;
    console.log(`Weekly growth percentage: ${weeklyGrowth.toFixed(2)}%`);
    console.log(`Daily growth percentage: ${dailyGrowth.toFixed(2)}%`);

    const chartData = [];
    console.log("Generating chart data for the past 7 days...");
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      
      const usersOnDay = users.filter(user => 
        user.createdAt >= date && user.createdAt < nextDate
      ).length;

      const formattedDate = formatDate(date);
      console.log(`Users on ${formattedDate}: ${usersOnDay}`);

      chartData.push({
        date: formattedDate,
        users: usersOnDay
      });
    }

    const result = {
      weeklyGrowth,
      dailyGrowth,
      totalUsers,
      todayUsers,
      chartData,
      lastRefreshed: new Date().toLocaleString()
    };
    console.log("Analytics data computation completed:", result);
    return result;
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    throw error;
  }
};

// TODO: Replace the above mock function with your actual Firebase integration
// Example Firebase integration:
/*
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from './firebase-config';

export const fetchAnalyticsData = async (): Promise<DashboardData> => {
  try {
    // Fetch user data from your Firebase collection
    const usersRef = collection(db, 'users');
    const q = query(usersRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    // Process the data to calculate metrics
    // ... your Firebase logic here
    
    return {
      weeklyGrowth,
      dailyGrowth,
      totalUsers,
      todayUsers,
      chartData
    };
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    throw error;
  }
};
*/
