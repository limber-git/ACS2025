export const config = {
  API_URL: 'http://192.168.100.6:3003/api',
  endpoints: {
    auth: {
      login: '/user/login',
      logout: '/user/logout',
      verify: '/user/verify',
      getAttendanceByUser: '/record/getRecordsByUser/:id',
      getApplicationsByUser: '/application/getApplicationsByUser/:id',
      getAttendanceByUserCalculated: '/record/getRecordsByUserCalculated/:id',
      submitApplication: '/application/createApplications',
      uploadImage: '/application/upload-image',
      getUserById: '/user/getUserById/:id',
      deleteApplication: '/application/deleteApplication/:applicationId',
    }
  }
};
