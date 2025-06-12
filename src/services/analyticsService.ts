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
  const start = new Date();
  start.setDate(start.getDate() - days);
  return { start, end };
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const fetchAnalyticsData = async (): Promise<DashboardData> => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    const users = snapshot.docs.map(doc => ({
      id: doc.id,
      createdAt: new Date(doc.data().createdAt)
    }));

    const totalUsers = users.length;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayUsers = users.filter(user => 
      user.createdAt >= today && user.createdAt < tomorrow
    ).length;

    const { start: weekStart, end: weekEnd } = getDateRange(7);

    const lastWeekUsers = users.filter(user => 
      user.createdAt >= weekStart && user.createdAt < weekEnd
    ).length;

    const weeklyGrowth = lastWeekUsers > 0 ? (lastWeekUsers / totalUsers) * 100 : 0;
    const dailyGrowth = todayUsers > 0 ? (todayUsers / totalUsers) * 100 : 0;

    const chartData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      
      const usersOnDay = users.filter(user => 
        user.createdAt >= date && user.createdAt < nextDate
      ).length;

      chartData.push({
        date: formatDate(date),
        users: usersOnDay
      });
    }

    return {
      weeklyGrowth,
      dailyGrowth,
      totalUsers,
      todayUsers,
      chartData,
      lastRefreshed: new Date().toLocaleString()
    };
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
