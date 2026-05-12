import express from "express";

import {
  getSessions,
} from "../controllers/sessionController.js";

import {
  getSessionEvents,
} from "../controllers/sessionEventController.js";

const router = express.Router();

router.get("/", getSessions);

router.get(
  "/:sessionId",
  getSessionEvents
);

export default router;