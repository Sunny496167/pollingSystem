class PollState {
  constructor() {
    this.reset();
  }

  reset() {
    this.activePoll = null;
    this.connectedStudents = new Map(); // studentId -> socket data
    this.studentAnswers = new Map(); // studentId -> answerId
    this.teacherSocket = null;
  }

  // Poll management
  createPoll(question, options) {
    if (this.activePoll) {
      throw new Error('An active poll already exists');
    }

    this.activePoll = {
      id: Date.now().toString(),
      question,
      options: options.map((option, index) => ({
        id: index,
        text: option,
        votes: 0
      })),
      createdAt: new Date().toISOString(),
      isActive: true
    };

    // Clear previous answers when creating new poll
    this.studentAnswers.clear();
    
    return this.activePoll;
  }

  getActivePoll() {
    return this.activePoll;
  }

  closePoll() {
    if (this.activePoll) {
      this.activePoll.isActive = false;
    }
    const finalResults = this.calculateResults();
    this.reset();
    return finalResults;
  }

  // Student management
  addStudent(studentId, socket) {
    this.connectedStudents.set(studentId, {
      socket,
      connectedAt: new Date().toISOString()
    });
  }

  removeStudent(studentId) {
    this.connectedStudents.delete(studentId);
    
    // Remove their answer if they had voted
    if (this.studentAnswers.has(studentId)) {
      const answerId = this.studentAnswers.get(studentId);
      this.studentAnswers.delete(studentId);
      
      // Recalculate votes
      if (this.activePoll) {
        this.activePoll.options[answerId].votes--;
      }
    }
  }

  getConnectedStudentsCount() {
    return this.connectedStudents.size;
  }

  // Answer management
  submitAnswer(studentId, answerId) {
    if (!this.activePoll || !this.activePoll.isActive) {
      throw new Error('No active poll available');
    }

    if (this.studentAnswers.has(studentId)) {
      throw new Error('Student has already submitted an answer');
    }

    if (answerId < 0 || answerId >= this.activePoll.options.length) {
      throw new Error('Invalid answer option');
    }

    if (!this.connectedStudents.has(studentId)) {
      throw new Error('Student not connected');
    }

    // Record the answer
    this.studentAnswers.set(studentId, answerId);
    
    // Update vote count
    this.activePoll.options[answerId].votes++;

    return this.calculateResults();
  }

  hasStudentAnswered(studentId) {
    return this.studentAnswers.has(studentId);
  }

  // Results calculation
  calculateResults() {
    if (!this.activePoll) {
      return null;
    }

    const totalVotes = this.studentAnswers.size;
    
    const results = {
      pollId: this.activePoll.id,
      question: this.activePoll.question,
      totalVotes,
      totalConnected: this.getConnectedStudentsCount(),
      options: this.activePoll.options.map(option => ({
        id: option.id,
        text: option.text,
        votes: option.votes,
        percentage: totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0
      })),
      isActive: this.activePoll.isActive,
      timestamp: new Date().toISOString()
    };

    return results;
  }

  // Teacher management
  setTeacher(socket) {
    this.teacherSocket = socket;
  }

  removeTeacher() {
    this.teacherSocket = null;
  }

  getTeacherSocket() {
    return this.teacherSocket;
  }

  // Utility methods
  getStudentSocket(studentId) {
    const student = this.connectedStudents.get(studentId);
    return student ? student.socket : null;
  }

  getAllStudentSockets() {
    return Array.from(this.connectedStudents.values()).map(student => student.socket);
  }

  getConnectionStats() {
    return {
      connectedStudents: this.getConnectedStudentsCount(),
      hasTeacher: !!this.teacherSocket,
      activePoll: !!this.activePoll,
      totalAnswers: this.studentAnswers.size
    };
  }
}

// Export singleton instance
module.exports = new PollState();