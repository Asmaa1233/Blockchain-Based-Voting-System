

import { Router } from "express";
import loginController from "../controllers/auth/login";
import checkController from "../controllers/auth/check";
import logoutController from "../controllers/auth/logout";
import valididController from "../controllers/auth/validid";


const router = Router();
  

router.post("/login", loginController);
router.post("/check", checkController);
router.post("/logout", logoutController);
router.post("/validid", valididController);

  

export default router;





