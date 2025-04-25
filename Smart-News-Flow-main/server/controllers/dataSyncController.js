const { users } = require('../services/websocketService');

exports.dataSync = (req, res) => {
  const {user_id , ...rest} = req.body;
  console.log('Data received from client:', req.body);
  if (users[user_id]) {
    users[user_id].send(JSON.stringify(req.body));
    res.status(200).send('Data sent to user');
  } else {
    console.log('User not found');
    res.status(404).send('User not found');
  }
};
