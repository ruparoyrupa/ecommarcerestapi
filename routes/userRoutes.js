import express from "express";

import {
  getAllUser,
  createUser,
  getSingleUser,
  deleteUser,
  updateUser,
} from "../controllers/userController.js";
import tokenVerify from "../middlewares/tokenVerify.js";

const router = express.Router();

router.use(tokenVerify);

// routing
router.route("/").get(getAllUser).post(createUser);
router.route("/:id").get(getSingleUser).delete(deleteUser).patch(updateUser);

// export
export default router;
