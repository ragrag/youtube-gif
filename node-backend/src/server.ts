import 'dotenv/config';
import './common/utils/handleRunErrors';
import App from './app';

import JobRoute from './api/routes/jobs.route';

import validateEnv from './common/utils/validateEnv';

(async () => {
  validateEnv();

  const app = new App([new JobRoute()]);
  await app.initializeApp();
  app.listen();
})();
