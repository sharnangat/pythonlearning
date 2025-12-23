const express = require('express');
const router = express.Router();
const { authenticate, checkRole } = require('../middleware/auth');
const { readRequests, readResponses, getRequestResponsePair } = require('../utils/requestResponseLogger');

router.use(authenticate);
router.use(checkRole('superAdmin', 'societyAdmin')); // Only admins can view logs

// Get recent requests
router.get('/requests', async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 100;
        const requests = readRequests(limit);
        res.json({
            success: true,
            data: { requests, count: requests.length }
        });
    } catch (error) {
        next(error);
    }
});

// Get recent responses
router.get('/responses', async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 100;
        const responses = readResponses(limit);
        res.json({
            success: true,
            data: { responses, count: responses.length }
        });
    } catch (error) {
        next(error);
    }
});

// Get request-response pair by requestId
router.get('/pair/:requestId', async (req, res, next) => {
    try {
        const { requestId } = req.params;
        const pair = getRequestResponsePair(requestId);
        
        if (!pair.request && !pair.response) {
            return res.status(404).json({
                success: false,
                message: 'Request/Response pair not found.'
            });
        }

        res.json({
            success: true,
            data: { pair }
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;

