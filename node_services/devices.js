const db = require('./db-module')

async function getStagedDevice(device) {
	let previouslyAdded = await db.executeGenericQuery('SELECT * FROM Devices where Devices.code = "' + device.key + '"');
	if (previouslyAdded.length) {
		return 'Device has already been added';
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
			return 'Please verify your device key and try again';
		}
	} else {
		return 'No staging device for ' + device.key;
	}
}

async function isDeviceStaged(key) {
	let results = await db.executeGenericQuery('SELECT * FROM Staging_Devices where Staging_Devices.key = "' + key + '"');
	return results.length === 1;
}

async function getUser(email) {
	try	{
		let userID = await db.executeGenericQuery('SELECT * FROM Users WHERE Users.email = "' + email + '" LIMIT 1');
		console.log(userID);
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
		let user = await getUser(email); console.log(user);
		return db.executeGenericQuery('SELECT * FROM Devices WHERE Devices.user_id = ' + user.id);
	} catch(error) {
		throw 'Error getting devices for user: ' + email;
	}
}

async function registerStagingDevice(data) {
	let validMAC = await db.executeGenericQuery('SELECT * FROM mac_keys where mac_keys.mac_address = "' + data.mac + '"');
	if (validMAC.length) {
		let key = validMAC[0].key;
		let insertQuery = 'INSERT IGNORE INTO Staging_Devices VALUES(null,"' + key + '", "' + data.type + '", CURDATE()' + ', "' + data.mac + '", NOW(),' + ' 1)';
		
		let insertResult = await db.executeGenericQuery(insertQuery);
		if (insertResult.affectedRows) {
			return 'Device ' + data.mac + ' staged successfully';
		}
	} else {
		return "Invalid MAC. Mac doesn't exist on mac_keys table";
	}
}

// EXPORTS
exports.getStagedDevice = getStagedDevice;
exports.getDevicesForUser = getDevicesForUser;
exports.registerStagingDevice = registerStagingDevice;