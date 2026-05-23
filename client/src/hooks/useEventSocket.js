import { useEffect } from 'react';
import { getSocket } from '../services/socket';

export function useEventSocket(eventId, handlers = {}) {
  useEffect(() => {
    if (!eventId) return undefined;
    const socket = getSocket();
    socket.emit('join-event', eventId);

    Object.entries(handlers).forEach(([eventName, handler]) => {
      if (handler) socket.on(eventName, handler);
    });

    return () => {
      Object.entries(handlers).forEach(([eventName, handler]) => {
        if (handler) socket.off(eventName, handler);
      });
    };
  }, [eventId, handlers]);
}
