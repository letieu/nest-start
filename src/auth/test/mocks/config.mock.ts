export const mockedConfigService = {
  get(key: string) {
    switch (key) {
      case 'JWT_KEY':
        return 'asdfadsf';
      case 'JWT_EXPIRED_TIME':
        return '30d';
    }
  },
};
