import express from 'express';
import {
    approveRequest,
    createRequest,
    deleteRequest,
    denyRequest,
    getAllRequests,
    getNearbyRequests,
    getPendingRequests,
    getRequestById,
    getRequestStatistics,
    getUserRequests,
    updateRequest
} from '../controllers/requestController.js';
import {
    authenticate,
    authorizeAdmin,
    authorizeUser
} from '../middlewares/auth.js';
import {
    validateId,
    validateQueryParams,
    validateRequestApproval,
    validateRequestCreation
} from '../middlewares/validation.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Request management routes
router.post('/', authorizeUser, validateRequestCreation, createRequest);
router.get('/user/me', authorizeUser, validateQueryParams, getUserRequests);
router.get('/nearby', authorizeUser, validateQueryParams, getNearbyRequests);

// Request CRUD routes
router.get('/:requestId', authorizeUser, validateId, getRequestById);
router.put('/:requestId', authorizeUser, validateId, updateRequest);
router.delete('/:requestId', authorizeUser, validateId, deleteRequest);

// Admin routes
router.get('/', authorizeAdmin, validateQueryParams, getAllRequests);
router.get('/pending', authorizeAdmin, validateQueryParams, getPendingRequests);
router.get('/statistics', authorizeAdmin, validateQueryParams, getRequestStatistics);
router.put('/:requestId/approve', authorizeAdmin, validateId, validateRequestApproval, approveRequest);
router.put('/:requestId/deny', authorizeAdmin, validateId, validateRequestApproval, denyRequest);

export default router;
