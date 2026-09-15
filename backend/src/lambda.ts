import serverlessHttp from 'serverless-http';
import { DatabaseService } from './shared/services/database/database.service';
import { LoggerService } from './shared/services/logger/logger.service';
import { JwtService } from './shared/services/jwt/jwt.service';
import { App } from './app';

// Singletons are initialized at module level so they survive across warm invocations.
// On a cold start Lambda runs this block once; subsequent requests reuse the same
// instances without paying the initialization cost again.
const db = DatabaseService.getInstance();
const logger = LoggerService.getInstance();
const jwt = JwtService.getInstance();

const app = App.create(db, logger, jwt);

// serverless-http wraps the Express app so AWS Lambda / API Gateway can invoke it.
// No app.listen() — Lambda manages the runtime lifecycle.
export const handler = serverlessHttp(app);
