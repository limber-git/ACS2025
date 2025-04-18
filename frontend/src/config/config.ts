export const config = {
  API_URL: 'http://localhost:3001/api',
  endpoints: {
    auth: {
      login: '/user/login',
      logout: '/user/logout',
      verify: '/user/verify'
    },
    // Aquí puedes agregar más endpoints organizados por funcionalidad
  }
};
