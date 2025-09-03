//  This model is used to extend the Express Request object with a 'user' property
//  so that we can attach the validated user information to the request after validating the JWT token.
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export interface User {
  id: number;
  email: string;
  iat: number;
  exp: number;
}
