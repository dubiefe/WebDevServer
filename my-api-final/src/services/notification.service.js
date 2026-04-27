// src/services/notification.service.js

import EventEmitter from 'events';

const emitter = new EventEmitter();

// Emitter
export const emitUserInvited = (payload) => {
  emitter.emit('user:invited', payload);
};

export const emitUserVerified = (payload) => {
  emitter.emit('user:verified', payload);
};

export const emitUserRegistered = (payload) => {
  emitter.emit('user:registered', payload);
};

export const emitUserDeleted = (payload) => {
  emitter.emit('user:deleted', payload);
};

// Listener
emitter.on('user:invited', ({ invitedUser, invitedBy }) => {
  console.log(`[EVENT] User invited: ${invitedUser.email} by ${invitedBy.email}`);
});

emitter.on('user:verified', ({ user }) => {
  console.log(`[EVENT] User verified: ${user.email}`);
});

emitter.on('user:registered', ({ user }) => {
  console.log(`[EVENT] User registered: ${user.email}`);
});

emitter.on('user:deleted', ({ user }) => {
  console.log(`[EVENT] User deleted: ${user.email}`);
});

export default emitter;