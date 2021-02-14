import 'dotenv/config';
import './common/utils/handleRunErrors';
import App from './app';

(async () => {
  const app = new App();
  await app.initializeApp();
})();
