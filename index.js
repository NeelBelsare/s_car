const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

let esp32Command = "stop"; // Default state is stop

app.post('/send-command', (req, res) => {
  const { command } = req.body;
  if (command) {
    esp32Command = command;
    console.log(`Received command from frontend: ${command}`);
    res.status(200).send({ message: `Command "${command}" received.` });

    if (command === "start_connection_blink") {
      console.log("Setting blink_led command for ESP32...");
      esp32Command = "blink_led";
      setTimeout(() => {
        esp32Command = "stop";
        console.log("Reverted ESP32 command to stop after connection blink.");
      }, 500);
    } else if (command === "honk") { // New: Handle honk command
        // Buzzer is a momentary action, so set it and then revert to 'stop'
        // or the previous movement command if you want to keep moving.
        // For simplicity, we'll set it to 'honk' and then revert to 'stop'.
        // If the car is already moving, you might want to revert to the last movement command.
        // For now, it will simply sound the buzzer and then stop.
        console.log("Setting honk command for ESP32...");
        esp32Command = "honk";
        setTimeout(() => {
            esp32Command = "stop"; // Revert to stop after honk
            console.log("Reverted ESP32 command to stop after honk.");
        }, 600); // Give ESP32 time to poll and get 'honk', then revert
    }

  } else {
    res.status(400).send({ message: "No command provided." });
  }
});

app.get('/command', (req, res) => {
  res.status(200).send(esp32Command);
});

app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`);
});
