export const serviceDiscoveryNamespace = 'hivedive';

export const getAuthEnvConfig = (): any => {
  const authEnvConfig: any = {};

  switch (process.env.APP_STAGE) {
    case 'development':
      authEnvConfig.userPoolId = 'eu-central-1_dEht1JWXi';
      authEnvConfig.userPoolWebClientId = '30b5stvm9ueo53hu8jt2kfs0td';
      break;
    case 'test':
      authEnvConfig.userPoolId = 'eu-central-1_ITfib17Uu';
      authEnvConfig.userPoolWebClientId = '4uat3ul6agn2dsipki1kvifq0b';
      break;
    case 'production':
      authEnvConfig.userPoolId = 'eu-central-1_dajdkLW0m';
      authEnvConfig.userPoolWebClientId = '4lbatrkhi1q20f6us7ti8rqtfb';
      break;
    default:
      break;
  }

  return authEnvConfig;
};

export const getOAuthEnvConfig = (): any => {
  const oAuthEnvConfig: any = {};

  switch (process.env.APP_STAGE) {
    case 'development':
      oAuthEnvConfig.domain = 'hivedive.auth.eu-central-1.amazoncognito.com';
      oAuthEnvConfig.redirectSignIn = 'http://localhost:3006';
      oAuthEnvConfig.redirectSignOut = 'http://localhost:3006';
      break;
    case 'test':
      oAuthEnvConfig.domain = 'auth-test.hivedive.io';
      oAuthEnvConfig.redirectSignIn = 'https://app-test.hivedive.io';
      oAuthEnvConfig.redirectSignOut = 'https://app-test.hivedive.io';
      break;
    case 'production':
      oAuthEnvConfig.domain = 'auth.hivedive.io';
      oAuthEnvConfig.redirectSignIn = 'https://app.hivedive.io';
      oAuthEnvConfig.redirectSignOut = 'https://app.hivedive.io';
      break;
    default:
      break;
  }

  return oAuthEnvConfig;
};

export const getRoot = (serviceName: string, port: string, path: string): string => {
  let root = '';
  switch (process.env.APP_STAGE) {
    case 'development':
      root = `http://localhost:${port}/${path}`;
      break;
    case 'test':
      root = `https://bff-test.hivedive.io/${serviceName}-service/${path}`;
      break;
    case 'production':
      root = `https://bff.hivedive.io/${serviceName}-service/${path}`;
      break;
    default:
      break;
  }

  return root;
};
