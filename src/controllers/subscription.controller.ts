import { Request, Response } from "express";
import { logger } from "../utils";
import {
  response_service,
  subscription_service,
  subscripiton_insclusions_service,
} from "../services";

async function getAllPlans(req: Request, res: Response) {
  try {
    const plans = await subscription_service.getAllPlans(
      req.body.page,
      req.body.limit
    );
    if (!plans || plans.data.length === 0) {
      return response_service.notFoundResponse(res, "No plans found.");
    }
    return response_service.successResponse(
      res,
      "Plans retrieved successfully.",
      {
        data: plans.data,
        pagination: {
          page: parseInt(req.body.page),
          limit: parseInt(req.body.limit),
          total: plans.total,
        },
      }
    );
  } catch (err: any) {
    logger.error("Error retrieving plans:", err);
    return response_service.internalServerErrorResponse(res, err.message);
  }
}

async function getPlanById(req: Request, res: Response) {
  try {
    const plan = await subscription_service.getPlanById(
      parseInt(req.body.plan_id)
    );
    if (!plan) {
      return response_service.notFoundResponse(res, "Plan not found.");
    }
    return response_service.successResponse(
      res,
      "Plan retrieved successfully.",
      plan
    );
  } catch (err: any) {
    logger.error("Error retrieving plan:", err);
    return response_service.internalServerErrorResponse(res, err.message);
  }
}

async function createPlan(req: Request, res: Response) {
  try {
    const plan = await subscription_service.createPlan(req.body);
    return response_service.successResponse(
      res,
      "Plan created successfully.",
      plan
    );
  } catch (err: any) {
    logger.error("Error creating plan:", err);
    return response_service.internalServerErrorResponse(res, err.message);
  }
}

async function updatePlan(req: Request, res: Response) {
  try {
    const plan = await subscription_service.updatePlan(req.body, {
      plan_id: req.body.plan_id,
    });
    if (!plan) {
      return response_service.notFoundResponse(res, "Plan not found.");
    }
    return response_service.successResponse(
      res,
      "Plan updated successfully.",
      plan
    );
  } catch (err: any) {
    logger.error("Error updating plan:", err);
    return response_service.internalServerErrorResponse(res, err.message);
  }
}

async function deletePlan(req: Request, res: Response) {
  try {
    const plan = await subscription_service.deletePlan({
      plan_id: req.body.plan_id,
    });
    if (!plan) {
      return response_service.notFoundResponse(res, "Plan not found.");
    }
    return response_service.successResponse(
      res,
      "Plan deleted successfully.",
      plan
    );
  } catch (err: any) {
    logger.error("Error deleting plan:", err);
    return response_service.internalServerErrorResponse(res, err.message);
  }
}

async function getAllInclusions(req: Request, res: Response) {
  try {
    const inclusions = await subscripiton_insclusions_service.getAllInclusions(
      req.body.page,
      req.body.limit
    );
    if (!inclusions || inclusions.data.length === 0) {
      return response_service.notFoundResponse(res, "No inclusions found.");
    }

    return response_service.successResponse(
      res,
      "Inclusions retrieved successfully.",
      {
        data: inclusions.data,
        pagination: {
          page: parseInt(req.body.page),
          limit: parseInt(req.body.limit),
          total: inclusions.total,
        },
      }
    );
  } catch (err: any) {
    logger.error("Error retrieving inclusions:", err);
    return response_service.internalServerErrorResponse(res, err.message);
  }
}

async function getInclusionById(req: Request, res: Response) {
  try {
    const inclusion = await subscripiton_insclusions_service.getInclusionById(
      parseInt(req.body.inclusion_id)
    );
    if (!inclusion) {
      return response_service.notFoundResponse(res, "Inclusion not found.");
    }
    return response_service.successResponse(
      res,
      "Inclusion retrieved successfully.",
      inclusion
    );
  } catch (err: any) {
    logger.error("Error retrieving inclusion:", err);
    return response_service.internalServerErrorResponse(res, err.message);
  }
}

async function createInclusion(req: Request, res: Response) {
  try {
    const inclusion = await subscripiton_insclusions_service.createInclusion(
      req.body
    );
    return response_service.successResponse(
      res,
      "Inclusion created successfully.",
      inclusion
    );
  } catch (err: any) {
    logger.error("Error creating inclusion:", err);
    return response_service.internalServerErrorResponse(res, err.message);
  }
}

async function updateInclusion(req: Request, res: Response) {
  try {
    const inclusion = await subscripiton_insclusions_service.updateInclusion(
      req.body,
      { inclusion_id: req.body.inclusion_id }
    );
    if (!inclusion) {
      return response_service.notFoundResponse(res, "Inclusion not found.");
    }
    return response_service.successResponse(
      res,
      "Inclusion updated successfully.",
      inclusion
    );
  } catch (err: any) {
    logger.error("Error updating inclusion:", err);
    return response_service.internalServerErrorResponse(res, err.message);
  }
}

async function deleteInclusion(req: Request, res: Response) {
  try {
    const inclusion = await subscripiton_insclusions_service.deleteInclusion({
      inclusion_id: req.body.inclusion_id,
    });
    if (!inclusion) {
      return response_service.notFoundResponse(res, "Inclusion not found.");
    }
    return response_service.successResponse(
      res,
      "Inclusion deleted successfully.",
      inclusion
    );
  } catch (err: any) {
    logger.error("Error deleting inclusion:", err);
    return response_service.internalServerErrorResponse(res, err.message);
  }
}

async function associateInclusionToPlan(req: Request, res: Response) {
  try {
    const association =
      await subscripiton_insclusions_service.associateInclusionToPlan(
        req.body.plan_id,
        req.body.inclusion_id
      );
    return response_service.successResponse(
      res,
      "Inclusion associated to plan successfully.",
      association
    );
  } catch (err: any) {
    logger.error("Error associating inclusion to plan:", err);
    return response_service.internalServerErrorResponse(res, err.message);
  }
}

export {
  getAllPlans,
  getPlanById,
  createPlan,
  updatePlan,
  deletePlan,
  getAllInclusions,
  getInclusionById,
  createInclusion,
  updateInclusion,
  deleteInclusion,
  associateInclusionToPlan,
};
