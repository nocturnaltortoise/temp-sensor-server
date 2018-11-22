# temp-sensor-server
A server for gathering temperature readings from ESP8826 temperature sensors.

At the moment this has both the node backend and the beginnings of the vuejs frontend in the same repo, but they are completely separate.

The backend expects temperature readings sent via POST request to /reading, with a MAC address to identify the sensor (which has to be added in the database manually, I'll make a route for this later).
I'm using an ESP8826 with a DHT22 sensor, with code written in Arduino to get the reading and send the request.

The frontend just sends HTTP requests to the backend for data, hence why they are separate - the backend just provides a (very simple at the moment) HTTP api for data.
