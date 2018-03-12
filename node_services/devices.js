const db = require('./db-module')

async function getStagedDevice(device) {
	try {
		let previouslyAdded = await db.executeGenericQuery('SELECT * FROM Devices where Devices.code = "' + device.key + '"');
		if (previouslyAdded.length) {
			throw 'Device has already been added';
		}
		let results = await db.executeGenericQuery('SELECT * FROM Staging_Devices where Staging_Devices.key = "' + device.key + '"');
		if (results.length === 1) {
			let insertQuery = 'INSERT INTO Devices (id,mac_address,state,user_id,code) VALUES(null,"' + device.mac_address +'", "0", "' + device.user_id  + '", "' + device.key + '" )';
			let insertResult = await db.executeGenericQuery(insertQuery);
			if (insertResult.affectedRows) {
				return 'Device ' + device.key + ' added successfully';
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