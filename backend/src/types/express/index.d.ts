import AuthenticatedUser from "../internal/authenticated_user";

declare global {
  namespace Express {
    export interface Request {
      user?: AuthenticatedUser;
      earlyReject: boolean = false;
    }
  }
}

// to make the file a module and avoid the TypeScript error
export {}
