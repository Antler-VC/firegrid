export const nth = (n: number) =>
  n + (['st', 'nd', 'rd'][((((n + 90) % 100) - 10) % 10) - 1] || 'th');

export const firetableUser = (currentUser: Record<string, any>) => {
  const {
    displayName,
    email,
    uid,
    emailVerified,
    isAnonymous,
    photoURL,
  } = currentUser;
  return {
    timestamp: new Date(),
    displayName,
    email,
    uid,
    emailVerified,
    isAnonymous,
    photoURL,
  };
};
