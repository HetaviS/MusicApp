import { ISubscriptionPlans } from "../types";
import { PlanInclusions, SubscriptionInclusionsAssociation } from "../models";

async function getAllInclusions(page: number = 1, limit: number = 10): Promise<{
    data: ISubscriptionPlans[];
    total: number;
}> {
    try {
        const offset = (page - 1) * limit;
        const inclusions = await PlanInclusions.findAll({
            where: { is_deleted: false },
            limit,
            offset,
        });
        const total = await PlanInclusions.count({ where: { is_deleted: false } });
        const data = inclusions.map(inclusion => inclusion.toJSON());
        return {data, total};
    } catch (err) {
        throw err;
    }
}

async function getInclusionById(inclusionId: number): Promise<ISubscriptionPlans | undefined> {
    try {
        const inclusion = await PlanInclusions.findOne({
            where: { inclusion_id: inclusionId, is_deleted: false },
        });
        return inclusion?.toJSON();
    } catch (err) {
        throw err;
    }
}

async function createInclusion(payload: any): Promise<ISubscriptionPlans> {
    try {
        const inclusion = await PlanInclusions.create(payload);
        return inclusion.toJSON();
    } catch (err) {
        throw err;
    }
}

async function updateInclusion(payload: any, where: any): Promise<ISubscriptionPlans | null> {
    try {
        const inclusion = await PlanInclusions.update(payload, { where: where, returning: true });
        if (inclusion[1].length <= 0) return null;
        return inclusion[1][0].toJSON();
    } catch (err) {
        throw err;
    }
}

async function deleteInclusion(where: any): Promise<ISubscriptionPlans | null> {
    try {
        const inclusion = await PlanInclusions.update({ is_deleted: true }, { where: where, returning: true });
        if (inclusion[1].length <= 0) return null;
        return inclusion[1][0].toJSON();
    } catch (err) {
        throw err;
    }
}

async function associateInclusionToPlan(planId: number, inclusionId: number): Promise<ISubscriptionPlans> {
    try {
        const association = await SubscriptionInclusionsAssociation.create({ plan_id: planId, inclusion_id: inclusionId });
        return association.toJSON();
    } catch (err) {
        throw err;
    }
}

export default {
    getAllInclusions,
    getInclusionById,
    createInclusion,
    updateInclusion,
    deleteInclusion,
    associateInclusionToPlan
};
