const notifier = (event, payload = null, io) => {
  io.on('connection', socket => {
    socket.emit(event, payload);
  });
};

export default notifier;
