const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

// This variable will hold the current command for the ESP32
let esp32Command = "stop"; // Default state is stop

// Endpoint for frontend to send commands
app.post('/send-command', (req, res) => {
  const { command } = req.body;
  if (command) {
    esp32Command = command;
    console.log(`Received command from frontend: ${command}`);
    res.status(200).send({ message: `Command "${command}" received.` });

    // Special handling for the initial 'start' button press
    if (command === "start_connection_blink") {
      // After blinking, immediately set the command to "stop"
      // or "forward" if you want it to move immediately after connection.
      // For this scenario, we want it to revert to a 'stop' state
      // once the blink is confirmed.
      setTimeout(() => {
        esp32Command = "stop";
        console.log("Reverted ESP32 command to stop after connection blink.");
      }, 500); // Give ESP32 time to poll and get the blink command
    }

  } else {
    res.status(400).send({ message: "No command provided." });
  }
});

// Endpoint for ESP32 to poll for commands
app.get('/command', (req, res) => {
  res.status(200).send(esp32Command);
  // For continuous controls, we don't clear the command here.
  // The ESP32 will keep executing the last received command until a new one arrives.
});

app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`);
});