import { io } from 'socket.io-client';
import { setPoll, updateResults } from '../store/pollSlice';

class SocketService {
  constructor() {
    this.socket = null;
    this.store = null;
  }

  connect(store) {
    this.store = store;
    this.socket = io('http://localhost:3001');

    this.socket.on('connect', () => {
      console.log('Connected to server');
    });

    this.socket.on('poll-question', (data) => {
      console.log('Received poll question:', data);
      this.store.dispatch(setPoll(data));
    });

    this.socket.on('poll-results', (data) => {
      console.log('Received poll results:', data);
      this.store.dispatch(updateResults(data));
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  joinAsStudent(name) {
    if (this.socket) {
      this.socket.emit('join-student', { name });
    }
  }

  joinAsTeacher() {
    if (this.socket) {
      this.socket.emit('join-teacher');
    }
  }

  createPoll(pollData) {
    if (this.socket) {
      this.socket.emit('create-poll', pollData);
    }
  }

  submitAnswer(answer) {
    if (this.socket) {
      this.socket.emit('submit-answer', { answer });
    }
  }
}

export default new SocketService();