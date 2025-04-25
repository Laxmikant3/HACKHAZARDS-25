const { eventEmitter } = require('../events/eventEmitter');

exports.streamData = (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  console.log("Client connected to stream");

  const onDataEvent = (data) => {
    try {
      res.write(`${data}\n\n`);
    } catch (error) {
      console.error('Error sending data:', error);
      res.end();
    }
  };

  eventEmitter.on('data-event', onDataEvent);

  req.on('close', () => {
    console.log('Client disconnected from stream');
    eventEmitter.off('data-event', onDataEvent);
    res.end();
  });
};
