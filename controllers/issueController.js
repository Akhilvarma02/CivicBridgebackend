const Issue = require('../models/Issue');

exports.createIssue = async (req, res) => {
  try {
    const { areaType, town, issueType, description } = req.body;

    if (!areaType || !town || !issueType || !description) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    const issueId = 'CB-' + Math.floor(100000 + Math.random() * 900000);

    const issue = await Issue.create({
      issueId,
      userId: req.user._id,
      areaType,
      town,
      issueType,
      description,
      status: 'Submitted'
    });

    res.status(201).json(issue);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findOne({ issueId: req.params.id });

    if (issue) {
      res.json(issue);
    } else {
      res.status(404).json({ message: 'Issue not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.getAllIssues = async (req, res) => {
  try {
    const issues = await Issue.find({}).sort({ createdAt: -1 });
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.updateIssueStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const issue = await Issue.findById(req.params.id);

    if (issue) {
      issue.status = status;
      const updatedIssue = await issue.save();
      res.json(updatedIssue);
    } else {
      res.status(404).json({ message: 'Issue not found' });
    }
  } catch (error) {
    console.error("[Issue ERROR]", error);
    res.status(500).json({ message: 'Server/Database Error connecting to Issue updating.' });
  }
};

exports.getMyIssues = async (req, res) => {
  try {
    const issues = await Issue.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(issues);
  } catch (error) {
    console.error("[Issue ERROR]", error);
    res.status(500).json({ message: 'Database query failed securely.' });
  }
};
