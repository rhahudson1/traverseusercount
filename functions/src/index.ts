import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const getTotalUsers = functions.https.onCall(async (data, context) => {
  // Check if the request is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'The function must be called while authenticated.'
    );
  }

  try {
    // List all users
    const listUsersResult = await admin.auth().listUsers();
    return {
      totalUsers: listUsersResult.users.length
    };
  } catch (error) {
    console.error('Error getting total users:', error);
    throw new functions.https.HttpsError(
      'internal',
      'An error occurred while getting total users.'
    );
  }
}); 