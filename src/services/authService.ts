import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '@/lib/firebase';

const functions = getFunctions(app);

interface TotalUsersResponse {
  totalUsers: number;
}

export const getTotalUsers = async (): Promise<number> => {
  try {
    const getTotalUsersFunction = httpsCallable<{}, TotalUsersResponse>(functions, 'getTotalUsers');
    const result = await getTotalUsersFunction();
    return result.data.totalUsers;
  } catch (error) {
    console.error('Error getting total users:', error);
    throw error;
  }
}; 