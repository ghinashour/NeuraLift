import { useEffect, useRef } from 'react';
import { initSocket, getSocket } from '../socket';

export default function useSocket(token, onNewLike) {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!token) return;

    const socket = initSocket(token);
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('socket connected', socket.id);
      // server joins room automatically (based on token) but you can confirm or join custom rooms
      // socket.emit('joinRoom', userId); // if needed
    });

    socket.on('new_like', (payload) => {
      console.log('new_like received', payload);
      if (onNewLike) onNewLike(payload);
    });

    socket.on('story_like_count_updated', (payload) => {
      // update UI if you show live like counters
      console.log('like count updated', payload);
    });

    socket.on('disconnect', () => console.log('socket disconnected'));

    return () => {
      socket.off('new_like');
      socket.off('story_like_count_updated');
      // don't close socket if you intend a single global socket; do it only if you want to cleanup fully
      // socket.close();
    };
  }, [token, onNewLike]);

  return socketRef;
}
