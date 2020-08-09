export const ifAuthenticated = (to, from, next) => {
  if (localStorage.token) {
    next();
  } else {
    next('/login');
  }
};
