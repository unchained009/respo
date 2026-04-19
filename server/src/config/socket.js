let ioInstance = null;

export const setSocketServer = (io) => {
  ioInstance = io;
};

export const getSocketServer = () => {
  if (!ioInstance) {
    throw new Error('Socket.io server is not initialized yet.');
  }

  return ioInstance;
};
