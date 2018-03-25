const db = require('./db-module')

async function getStagedDevice(device) {
	try {
		let previouslyAdded = await db.executeGenericQuery('SELECT * FROM Devices where Devices.code = "' + device.key + '"');
		if (previouslyAdded.length) {
			throw 'Device has already been added';
		}

		if (isDeviceStaged(device.key)) {
			// test if device is a valid device, i.e. has an existing key in mac_keys
			let registeredDevices = await db.executeGenericQuery('SELECT * FROM mac_keys WHERE mac_keys.key = "' + device.key + '"');
			if(registeredDevices.length === 1) {
				let userID = await db.executeGenericQuery('SELECT Users.id FROM Users WHERE Users.email = "' + device.email + '" LIMIT 1');
				let insertQuery = 'INSERT INTO Devices (id,mac_address,state,user_id,code,name) VALUES(null,"' + registeredDevices[0].mac_address +'", "0", "' + userID[0].id  + '", "' + device.key + '", "' + device.name + '" )';
				let insertResult = await db.executeGenericQuery(insertQuery);
				if (insertResult.affectedRows) {
					return 'Device ' + device.key + ' added successfully';
				} else {
					return 'There was an error adding device ' + device.key + ', please try again.'
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

async function isDeviceStaged(key) {
	let results = await db.executeGenericQuery('SELECT * FROM Staging_Devices where Staging_Devices.key = "' + key + '"');
	return results.length === 1;
}

async function getUser(email) {
	try	{
		let userID = await db.executeGenericQuery('SELECT * FROM Users WHERE Users.email = "' + email + '" LIMIT 1');
		if (userID.length === 1) {
			return userID[0];
		}
		else
			throw 'Error with user: ' + email;
	} catch(error) {
		throw 'No such user';
	}
}

async function getDevicesForUser(email) {
	try {
		let user = await getUser(email);
		let userDevices = await db.executeGenericQuery('SELECT * FROM Devices WHERE Devices.user_id = ' + user.id);
		return userDevices;
	} catch(error) {
		throw 'Error getting devices for user: ' + email;
	}
}

// EXPORTS
exports.getStagedDevice = getStagedDevice;
exports.getDevicesForUser = getDevicesForUser;