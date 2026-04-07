// src/services/notification.service.js

import EventEmitter from 'events';

const emitter = new EventEmitter();

// Emitter
export const emitUserInvited = (payload) => {
  emitter.emit('user:invited', payload);
};

// Listener
emitter.on('user:invited', ({ invitedUser, invitedBy }) => {
  console.log(`[EVENT] User invited: ${invitedUser.email} by ${invitedBy.email}`);
});

export default emitter;