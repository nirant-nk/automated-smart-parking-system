import express from 'express';
import {
    approveRequest,
    createRequest,
    deleteRequest,
    denyRequest,
    getAllRequests,
    getApprovedRequests,
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
    validateQueryParams,
    validateRequestApproval,
    validateRequestId
} from '../middlewares/validation.js';

const router = express.Router();

// Public routes (no authentication required)
router.get('/approved', validateQueryParams, getApprovedRequests);

// All other routes require authentication
router.use(authenticate);

// Request management routes
// router.post('/', authorizeUser, validateRequestCreation, createRequest);
router.post('/', authorizeUser, createRequest);
router.get('/user/me', authorizeUser, validateQueryParams, getUserRequests);
router.get('/nearby', authorizeUser, validateQueryParams, getNearbyRequests);

// Request CRUD routes
router.get('/:requestId', authorizeUser, validateRequestId, getRequestById);
router.put('/:requestId', authorizeUser, validateRequestId, updateRequest);
router.delete('/:requestId', authorizeUser, validateRequestId, deleteRequest);

// Admin routes
router.get('/', authorizeAdmin, validateQueryParams, getAllRequests);
router.get('/pending', authorizeAdmin, validateQueryParams, getPendingRequests);
router.get('/statistics', authorizeAdmin, validateQueryParams, getRequestStatistics);
router.put('/:requestId/approve', authorizeAdmin, validateRequestId, validateRequestApproval, approveRequest);
router.put('/:requestId/deny', authorizeAdmin, validateRequestId, validateRequestApproval, denyRequest);

export default router;
