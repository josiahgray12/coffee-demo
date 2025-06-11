const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const app = express();
const port = 3001;

app.use(cors());

app.get('/run-payment', (req, res) => {
  console.log(req.query);
  const cardId = req.query.cardId;
  const customerFirstName = req.query.firstName;
  const customerLastName = req.query.lastName;
  console.log(`cardId: ${cardId}`);
  console.log(`customerFirstName: ${customerFirstName}`);
  console.log(`customerLastName: ${customerLastName}`);
  if (!cardId) {
    return res.status(400).json({ error: 'cardId is required' });
  }

  const command = `/bin/sh ./src/payment.sh ${cardId} ${customerFirstName} ${customerLastName}`;
  console.log(`Executing command: ${command}`);

  exec(command, (error, stdout, stderr) => {
    console.log("Executing payment script...");
    if (error) {
      console.error(`Error: ${error.message}`);
      return res.status(500).json({ error: error.message });
    }
    if (!stdout.includes('succeeded')) {
      console.log(`Stdout: ${stdout}`);
      console.error(`Stderr: ${stderr}`);
      return res.status(500).json({ error: stderr });
    }
    console.log(`Stdout: ${stdout}`);
    res.status(200).json({ message: stdout });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});