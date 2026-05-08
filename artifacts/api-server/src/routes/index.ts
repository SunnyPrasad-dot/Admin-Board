import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import dashboardRouter from "./dashboard";
import bookingsRouter from "./bookings";
import inquiriesRouter from "./inquiries";
import photographersRouter from "./photographers";
import packagesRouter from "./packages";
import addonsRouter from "./addons";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/dashboard", dashboardRouter);
router.use("/bookings", bookingsRouter);
router.use("/inquiries", inquiriesRouter);
router.use("/photographers", photographersRouter);
router.use("/packages", packagesRouter);
router.use("/addons", addonsRouter);

export default router;
