import { logger } from "../utils";
import { home_service, response_service } from "../services/index.service";
import { Request, Response } from 'express';

async function songsByGenre(req: Request, res: Response) {
    try {
        const songs = await home_service.getAllSongsByGenre();
        if (!songs || songs.length === 0) {
            return response_service.notFoundResponse(res, 'No songs found.');
        }
        return response_service.successResponse(res, 'Songs retrieved successfully.', songs);
    } catch (err: any) {
        logger.error('Error retrieving songs:', err);
        return response_service.internalServerErrorResponse(res, err.message);
    }
}

async function createBlock(req: Request, res: Response) {
    try {
        const block = await home_service.addBlock(req.body);
        return response_service.successResponse(res, 'Block added successfully.', { block });
    } catch (err: any) {
        logger.error('Error adding block:', err);
        return response_service.internalServerErrorResponse(res, err.message);
    }
}

async function updateBlock(req: Request, res: Response) {
    try {
        const block = await home_service.updateBlock(req.body, parseInt(req.body.block_id));
        if (!block) {
            return response_service.notFoundResponse(res, 'Block not found.');
        }
        return response_service.successResponse(res, 'Block updated successfully.', { block });
    } catch (err: any) {
        logger.error('Error updating block:', err);
        return response_service.internalServerErrorResponse(res, err.message);
    }
}

async function addDataToBlock(req: Request, res: Response) {
    try {
        const block = await home_service.addDataToBlock(parseInt(req.body.block_id), req.body);
        if (!block) {
            return response_service.notFoundResponse(res, 'Block not found.');
        }
        return response_service.successResponse(res, 'Data added to block successfully.', { block });
    } catch (err: any) {
        logger.error('Error adding data to block:', err);
        return response_service.internalServerErrorResponse(res, err.message);
    }
}

async function removeDataFromBlock(req: Request, res: Response) {
    try {
        const block = await home_service.removeDataFromBlock(parseInt(req.body.block_id), req.body);
        if (!block) {
            return response_service.notFoundResponse(res, 'Block not found.');
        }
        return response_service.successResponse(res, 'Data removed from block successfully.', { block });
    } catch (err: any) {
        logger.error('Error removing data from block:', err);
        return response_service.internalServerErrorResponse(res, err.message);
    }
}

async function getAllBlocks(req: Request, res: Response) {
    try {
        const blocks = await home_service.getAllBlocks();
        if (!blocks || blocks.blocks.length === 0) {
            return response_service.notFoundResponse(res, 'No blocks found.');
        }
        return response_service.successResponse(res, 'Blocks retrieved successfully.', blocks);
    } catch (err: any) {
        logger.error('Error retrieving blocks:', err);
        return response_service.internalServerErrorResponse(res, err.message);
    }
}

async function getBlockById(req: Request, res: Response) {
    try {
        const block = await home_service.getBlock(parseInt(req.body.block_id), req.body.limits ?? {}, parseInt(req.body.page)||req.body.page, parseInt(req.body.limit)||req.body.limit);
        if (!block) {
            return response_service.notFoundResponse(res, 'Block not found.');
        }
        return response_service.successResponse(res, 'Block retrieved successfully.', { block });
    } catch (err: any) {

        logger.error('Error retrieving block:', err);
        return response_service.internalServerErrorResponse(res, err.message);
    }
}

async function deleteBlock(req: Request, res: Response) {
    try {
        const block = await home_service.updateBlock({ is_deleted: true }, parseInt(req.body.block_id));
        if (!block) {
            return response_service.notFoundResponse(res, 'Block not found.');
        }
        return response_service.successResponse(res, 'Block deleted successfully.', { block });
    } catch (err: any) {
        logger.error('Error deleting block:', err);
        return response_service.internalServerErrorResponse(res, err.message);
    }

}

export {
    songsByGenre,
    createBlock,
    updateBlock,
    getAllBlocks,
    addDataToBlock,
    removeDataFromBlock,
    getBlockById,
    deleteBlock
};
