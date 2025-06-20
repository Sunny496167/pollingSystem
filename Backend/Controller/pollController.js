const pollState = require('../Models/pollState');

exports.getStatus = (req, res) => {
  try {
    const activePoll = pollState.getActivePoll();
    const results = pollState.calculateResults();
    const stats = pollState.getConnectionStats();

    res.json({
      success: true,
      data: { poll: activePoll, results, stats }
    });
  } catch (error) {
    console.error('Get poll status error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getResults = (req, res) => {
  try {
    const results = pollState.calculateResults();
    if (!results) {
      return res.status(404).json({ success: false, message: 'No active poll found' });
    }
    res.json({ success: true, data: results });
  } catch (error) {
    console.error('Get poll results error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getStats = (req, res) => {
  try {
    const stats = pollState.getConnectionStats();
    res.json({
      success: true,
      data: {
        ...stats,
        serverTime: new Date().toISOString(),
        uptime: process.uptime()
      }
    });
  } catch (error) {
    console.error('Get stats error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createPoll = (req, res) => {
  try {
    const { question, options } = req.body;

    if (!question || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ success: false, message: 'Valid question and at least 2 options are required' });
    }

    const poll = pollState.createPoll(question, options);

    res.status(201).json({
      success: true,
      message: 'Poll created successfully',
      data: poll
    });
  } catch (error) {
    console.error('Create poll error:', error.message);

    if (error.message.includes('active poll already exists')) {
      return res.status(409).json({ success: false, message: error.message });
    }

    res.status(500).json({ success: false, message: error.message });
  }
};

exports.closePoll = (req, res) => {
  try {
    const finalResults = pollState.closePoll();

    res.json({
      success: true,
      message: 'Poll closed successfully',
      data: finalResults
    });
  } catch (error) {
    console.error('Close poll error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getActivePoll = (req, res) => {
  try {
    const activePoll = pollState.getActivePoll();

    if (!activePoll) {
      return res.status(404).json({ success: false, message: 'No active poll found' });
    }

    res.json({ success: true, data: activePoll });
  } catch (error) {
    console.error('Get active poll error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.submitAnswer = (req, res) => {
  try {
    const { studentId, answerId } = req.body;

    if (!studentId || answerId === undefined || answerId === null) {
      return res.status(400).json({ success: false, message: 'Student ID and answer ID are required' });
    }

    const studentSocket = pollState.getStudentSocket(studentId);
    if (!studentSocket) {
      return res.status(400).json({ success: false, message: 'Student must be connected via socket to submit answers' });
    }

    const results = pollState.submitAnswer(studentId, answerId);

    res.json({ success: true, message: 'Answer submitted successfully', data: results });
  } catch (error) {
    console.error('Submit answer error:', error.message);

    if (error.message.includes('already submitted')) {
      return res.status(409).json({ success: false, message: error.message });
    }

    if (error.message.includes('No active poll') || error.message.includes('Invalid answer')) {
      return res.status(400).json({ success: false, message: error.message });
    }

    res.status(500).json({ success: false, message: error.message });
  }
};
