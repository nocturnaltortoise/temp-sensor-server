const express = require('express');
const fs = require('fs');
const { Client } = require('pg');

const configPath = './config.json';
const parsedConf = JSON.parse(fs.readFileSync(configPath, 'UTF-8'));

const client = new Client({
  user: parsedConf.user,
  database: parsedConf.database,
  password: parsedConf.password,
  host: parsedConf.host
});
client.connect();
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/", express.static(__dirname));

app.post('/reading', async (req, res) => {
  const temperatureReading = req.body.reading;
  const sensorMACAddress = req.body.mac;

  const sensorQuery = "SELECT sensor_id FROM sensors WHERE mac_address = $1 LIMIT 1;"
  const sensorQueryRes = await client.query(sensorQuery, [sensorMACAddress]);
  const sensorId = sensorQueryRes.rows[0].sensor_id;
  console.log(`Sensor ID is ${sensorId}`);

  console.log(temperatureReading, sensorMACAddress);
  const readingInsertQuery = "INSERT INTO temperature_readings (sensor_id, reading) VALUES ($1, $2)";
  const readingInsertRes = await client.query(readingInsertQuery, [sensorId, temperatureReading]);
  console.log(readingInsertRes.rows);
  res.sendStatus(204);
});

app.get('/readings', async (req, res) => {
  const readingsQuery = "SELECT timestamp, reading FROM temperature_readings WHERE sensor_id = 1 LIMIT 10;"
  const readings = await client.query(readingsQuery);
  res.send(readings.rows);
});

app.listen(3000, function(err) {
  if (err) {
    throw err;
  }

  console.log('Server started on port 3000');
});
