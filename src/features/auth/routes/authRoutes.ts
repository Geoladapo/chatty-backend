import express, { Router } from 'express';
import { SignUp } from '../controllers/signup';
import { SignIn } from '../controllers/signin';
import { Signout } from '../controllers/signout';

class AuthRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.post('/signup', SignUp.prototype.create);
    this.router.post('/signin', SignIn.prototype.read);

    return this.router;
  }

  public signoutRoutes(): Router {
    this.router.post('/signout', Signout.prototype.update);

    return this.router;
  }
}

export const authRoutes: AuthRoutes = new AuthRoutes();
