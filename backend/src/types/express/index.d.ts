import AuthenticatedUser from "../internal/authenticated_user";

declare global {
  namespace Express {
    export interface Request {
      user?: AuthenticatedUser;
    }
  }
}

// to make the file a module and avoid the TypeScript error
export {}
