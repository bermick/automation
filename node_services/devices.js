const db = require('./db-module')

async function getStagedDevice(device) {
	try {
		let previouslyAdded = await db.executeGenericQuery('SELECT * FROM Devices where Devices.code = "' + device.key + '"');
		if (previouslyAdded.length) {
			throw 'Device has already been added';
		}
		let results = await db.executeGenericQuery('SELECT * FROM Staging_Devices where Staging_Devices.key = "' + device.key + '"');

		if (results.length === 1) {
			let registeredDevices = await db.executeGenericQuery('SELECT * FROM mac_keys WHERE mac_keys.key = "' + device.key + '"');
			if(registeredDevices.length === 1) {
				let userID = await db.executeGenericQuery('SELECT Users.id FROM Users WHERE Users.email = "' + device.email + '"');
				let insertQuery = 'INSERT INTO Devices (id,mac_address,state,user_id,code) VALUES(null,"' + registeredDevices[0].mac_address +'", "0", "' + userID[0].id  + '", "' + device.key + '" )';
				let insertResult = await db.executeGenericQuery(insertQuery);
				if (insertResult.affectedRows) {
					return 'Device ' + device.key + ' added successfully';
				}
			} else {
				throw 'Please verify your device key and try again';
			}
		} else {
			throw 'No staging device for ' + device.key;
		}
	} catch(err) {
		return err;
	}
}

// EXPORTS
exports.getStagedDevice = getStagedDevice;