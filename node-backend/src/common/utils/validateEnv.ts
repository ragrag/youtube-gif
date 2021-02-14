import { cleanEnv, port, str } from 'envalid';

const validateEnv = () => {
  cleanEnv(process.env, {
    NODE_ENV: str(),
    PORT: port(),
    DATABASE_URL_PROD: str(),
    DATABASE_URL_DEV: str(),
  });
};

export default validateEnv;
