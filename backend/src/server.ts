import { DatabaseService } from './shared/services/database/database.service';
import { LoggerService } from './shared/services/logger/logger.service';
import { JwtService } from './shared/services/jwt/jwt.service';
import { config } from './shared/config';
import { App } from './app';

const logger = LoggerService.getInstance();
const db = DatabaseService.getInstance();
const jwt = JwtService.getInstance();

const app = App.create(db, logger, jwt);

app.listen(config.port, () => {
  logger.info(`Resume Builder backend listening on port ${config.port}`, { env: config.nodeEnv });
});
