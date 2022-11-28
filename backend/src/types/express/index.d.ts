
declare global {
  namespace Express {
    export interface Request {
      user?: string;
    }
  }
}

// to make the file a module and avoid the TypeScript error
export {}
