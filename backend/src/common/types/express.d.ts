// src/common/types/express.d.ts
import { User as UserEntity } from '@prisma/client';

declare global {
  namespace Express {
    interface User extends UserEntity {
      // Any additional fields attached to the request session by passport
    }

    interface Request {
      user?: User;
    }
  }
}
