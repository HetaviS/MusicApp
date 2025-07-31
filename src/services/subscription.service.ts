import { ISubscriptionPlans } from "../types";
import { SunscriptionPlans, SubscriptionInclusionsAssociation, PlanInclusions } from "../models";

async function getAllPlans(page: number = 1, limit: number = 10): Promise<{
    data: ISubscriptionPlans[];
    total: number;
}> {
    try {
        const offset = (page - 1) * limit;
        const plans = await SunscriptionPlans.findAll({
            where: { is_deleted: false },
            limit,
            offset,
            include: [
                {
                    model: SubscriptionInclusionsAssociation,
                    as: 'inclusionsAssociation',
                    include: [
                        {
                            model: PlanInclusions,
                            as: 'inclusion',
                        }
                    ]
                }
            ]
        }); 
        const data = plans.map((plan) => plan.toJSON());
        const total = await SunscriptionPlans.count({ where: { is_deleted: false } });
        return {
            data,
            total
        };
    } catch (err) {
        throw err;
    }
}

async function getPlanById(planId: number): Promise<ISubscriptionPlans | undefined> {
    try {
        const plan = await SunscriptionPlans.findOne({
            where: { plan_id: planId, is_deleted: false },
            include: [
                {
                    model: SubscriptionInclusionsAssociation,
                    as: 'inclusionsAssociation',
                    include: [
                        {
                            model: PlanInclusions,
                            as: 'inclusion',
                        }
                    ]
                }
            ]
        });
        return plan?.toJSON();
    } catch (err) {
        throw err;
    }
}

async function createPlan(payload: any): Promise<ISubscriptionPlans> {
    try {
        const plan = await SunscriptionPlans.create(payload);
        return plan.toJSON();
    } catch (err) {
        throw err;
    }
}

async function updatePlan(payload: any, where: any): Promise<ISubscriptionPlans | null> {
    try {
        const plan = await SunscriptionPlans.update(payload, { where: where, returning: true });
        if (plan[1].length <= 0) return null;
        return plan[1][0].toJSON();
    } catch (err) {
        throw err;
    }
}

async function deletePlan(where: any): Promise<ISubscriptionPlans | null> {
    try {
        const plan = await SunscriptionPlans.update({ is_deleted: true }, { where: where, returning: true });
        if (plan[1].length <= 0) return null;
        return plan[1][0].toJSON();
    } catch (err) {
        throw err;
    }
}

export default {
    getAllPlans,
    getPlanById,
    createPlan,
    updatePlan,
    deletePlan,
};      