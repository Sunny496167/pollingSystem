const pollState = require('../Models/pollState');

function socketHandler(io) {
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Handle teacher connection
    socket.on('join-teacher', (data) => {
      try {
        console.log('Teacher joined:', socket.id);
        pollState.setTeacher(socket);
        
        socket.emit('teacher-connected', {
          success: true,
          stats: pollState.getConnectionStats()
        });

        // Send current poll if exists
        const activePoll = pollState.getActivePoll();
        if (activePoll) {
          socket.emit('poll-question', activePoll);
          const results = pollState.calculateResults();
          socket.emit('poll-result', results);
        }

      } catch (error) {
        console.error('Teacher join error:', error.message);
        socket.emit('error', { message: error.message });
      }
    });

    // Handle student connection
    socket.on('join-student', (data) => {
      try {
        const { studentId } = data;
        
        if (!studentId) {
          throw new Error('Student ID is required');
        }

        console.log('Student joined:', studentId, socket.id);
        pollState.addStudent(studentId, socket);
        
        socket.studentId = studentId; // Store for cleanup
        
        socket.emit('student-connected', {
          success: true,
          studentId,
          stats: pollState.getConnectionStats()
        });

        // Send current poll if exists
        const activePoll = pollState.getActivePoll();
        if (activePoll) {
          socket.emit('poll-question', activePoll);
          
          // Check if student already answered
          const hasAnswered = pollState.hasStudentAnswered(studentId);
          if (hasAnswered) {
            socket.emit('answer-locked', { message: 'You have already submitted your answer' });
          }
        }

        // Notify teacher about new connection
        const teacherSocket = pollState.getTeacherSocket();
        if (teacherSocket) {
          teacherSocket.emit('student-count-update', {
            count: pollState.getConnectedStudentsCount()
          });
        }

      } catch (error) {
        console.error('Student join error:', error.message);
        socket.emit('error', { message: error.message });
      }
    });

    // Handle poll creation (teacher only)
    socket.on('create-poll', (data) => {
      try {
        const { question, options } = data;
        
        if (!question || !options || !Array.isArray(options) || options.length < 2) {
          throw new Error('Valid question and at least 2 options are required');
        }

        if (pollState.getTeacherSocket() !== socket) {
          throw new Error('Only teacher can create polls');
        }

        const poll = pollState.createPoll(question, options);
        console.log('Poll created:', poll.id);

        // Emit to all connected clients
        io.emit('poll-question', poll);
        
        // Send initial results to teacher
        const results = pollState.calculateResults();
        socket.emit('poll-result', results);

      } catch (error) {
        console.error('Create poll error:', error.message);
        socket.emit('error', { message: error.message });
      }
    });

    // Handle answer submission (students only)
    socket.on('submit-answer', (data) => {
      try {
        const { answerId } = data;
        const studentId = socket.studentId;
        
        if (!studentId) {
          throw new Error('Student not properly connected');
        }

        if (answerId === undefined || answerId === null) {
          throw new Error('Answer ID is required');
        }

        const results = pollState.submitAnswer(studentId, answerId);
        console.log(`Student ${studentId} answered:`, answerId);

        // Confirm to student that answer was recorded
        socket.emit('answer-submitted', {
          success: true,
          answerId,
          message: 'Your answer has been recorded'
        });

        // Lock further answers from this student
        socket.emit('answer-locked', { 
          message: 'Answer submitted successfully. You cannot change your answer.' 
        });

        // Emit updated results to all clients
        io.emit('poll-result', results);

      } catch (error) {
        console.error('Submit answer error:', error.message);
        socket.emit('error', { message: error.message });
      }
    });

    // Handle poll closure (teacher only)
    socket.on('close-poll', () => {
      try {
        if (pollState.getTeacherSocket() !== socket) {
          throw new Error('Only teacher can close polls');
        }

        const finalResults = pollState.closePoll();
        console.log('Poll closed');

        // Emit final results and poll closed event
        io.emit('poll-closed', finalResults);
        io.emit('poll-result', finalResults);

      } catch (error) {
        console.error('Close poll error:', error.message);
        socket.emit('error', { message: error.message });
      }
    });

    // Handle getting current poll status
    socket.on('get-poll-status', () => {
      try {
        const activePoll = pollState.getActivePoll();
        const results = pollState.calculateResults();
        
        socket.emit('poll-status', {
          poll: activePoll,
          results: results,
          stats: pollState.getConnectionStats()
        });

      } catch (error) {
        console.error('Get poll status error:', error.message);
        socket.emit('error', { message: error.message });
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      
      // Clean up student connection
      if (socket.studentId) {
        pollState.removeStudent(socket.studentId);
        console.log('Student removed:', socket.studentId);
        
        // Notify teacher about disconnection
        const teacherSocket = pollState.getTeacherSocket();
        if (teacherSocket) {
          teacherSocket.emit('student-count-update', {
            count: pollState.getConnectedStudentsCount()
          });
          
          // Update results if student had voted
          const activePoll = pollState.getActivePoll();
          if (activePoll) {
            const results = pollState.calculateResults();
            io.emit('poll-result', results);
          }
        }
      }
      
      // Clean up teacher connection
      if (pollState.getTeacherSocket() === socket) {
        pollState.removeTeacher();
        console.log('Teacher disconnected');
      }
    });

    // Handle connection errors
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });

  // Log server stats periodically
  setInterval(() => {
    const stats = pollState.getConnectionStats();
    if (stats.connectedStudents > 0 || stats.hasTeacher) {
      console.log('Server stats:', stats);
    }
  }, 30000); // Every 30 seconds
}

module.exports = socketHandler;