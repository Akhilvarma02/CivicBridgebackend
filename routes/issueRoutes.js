const express = require('express');
const router = express.Router();
const {
  createIssue,
  getIssueById,
  getAllIssues,
  updateIssueStatus,
  getMyIssues
} = require('../controllers/issueController');
const { protect, adminOrPolitician } = require('../middleware/authMiddleware');

router.post('/', protect, createIssue);
router.get('/my', protect, getMyIssues);
router.get('/track/:id', getIssueById);
router.get('/', protect, adminOrPolitician, getAllIssues);
router.put('/:id', protect, adminOrPolitician, updateIssueStatus);

module.exports = router;
