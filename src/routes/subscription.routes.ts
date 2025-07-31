import { Router } from "express";
import { validateBody } from "../middleware/zod.middleware";
import { getAllPlans, getPlanById, createPlan, updatePlan, deletePlan, getAllInclusions, getInclusionById, createInclusion, updateInclusion, deleteInclusion } from "../controllers/subscription.controller";
import z from "zod";

const router = Router();

router.post('/get-subscription-plans', getAllPlans);
router.post('/get-subscription-inclusions', getAllInclusions);

export default router;