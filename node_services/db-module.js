'use strict'

// REQUIRES
const mysql = require('mysql');
const nconf = require('nconf');

// VARIABLES GLOBALES
var connectionData;
var connectionPool;

nconf.argv()
   .env()
   .file({ file: './config.json' });
connectionData = nconf.get('connectionData');


// FUNCIONES
var createPool = function(connectionData) {
	connectionPool = mysql.createPool(connectionData);
};

var getConnection = function(callback) {
    connectionPool.getConnection(function(err, connection) {
        callback(err, connection);
    });
};

var closeConnection = function() {
	if (connectionPool) {
		connectionPool.end();
		console.log("Connection Pool ended!");
	}
	else
		console.err("No connection pool provided")
};

var executeGenericQuery = function(query) {
	return new Promise(function(resolve, reject) {
		connectionPool.getConnection(function(err, connection) {
			connection.query(query, function (error, results, fields) {
				if (error) reject(error);
				resolve(results);
			});
		});
	});
};

createPool(connectionData)


// PRUEBAS

// EXPORTS
exports.closeConnection = closeConnection;
exports.executeGenericQuery = executeGenericQuery;