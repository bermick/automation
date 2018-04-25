'use strict'

const mosca = require('mosca')
const redis = require('redis')
const axios = require('axios')
const PORT = 1884;
const BASE_URL = "http://localhost:3333"

var ascoltatore = {
  type: 'redis',
  redis: redis,
  db: 12,
  port: 6379,
  return_buffers: true, // to handle binary payloads, +performance
  host: "localhost"
};

var server = new mosca.Server({
  http: {
    port: PORT,
    bundle: true,
    static: './'
  },
  backend: ascoltatore,
  persistence: {
    factory: mosca.persistence.Redis
  }
});

server.on('ready', setup);

server.on('clientConnected', function(client) {
	// authentication
	// authorization
	console.log('client connected', client.id);		
});
server.on('clientDisconnected', function(client) {
	console.log('client disconnected', client.id);		
});

// fired when a message is received
server.on('published', function(packet, client) {
	let msg = packet.payload.toString();
	// buscar en dispositivos registrados
	// actualizar su estado
	if(packet.topic === 'device/stage') {
		postToLocal(packet.payload);
	}
	console.log('Payload', msg);
	console.log('Topic', packet.topic);

	
});

function postToLocal(data) {
  const url = `${BASE_URL}/api/register/staging-device`;
  return axios.post(url,
  	JSON.parse(data)
  ).then(response => {
  	console.log(response.data);
  	var message = {
	  topic: 'device/staged',
	  payload: 'SUCCESS', // or a Buffer
	  qos: 0, // 0, 1, or 2
	  retain: false // or true
	};
  	server.publish(message, function() {
	  console.log('done!');
	});
  });
}

server.on('error', handleError)

process.on('uncaughtException', handleError)
process.on('unhandledRejection', handleError)

function handleError(error) {
	console.error(error.stack)
	process.exit(1)
}

// fired when the mqtt server is ready
function setup() {
  console.log('Mosca server is up and listening on: ' + PORT)
}