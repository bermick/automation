const db = require('./db-module')

async function registerUser(user) {
	try {

		let previouslyAdded = await db.executeGenericQuery('SELECT * FROM Users where Users.email = "' + user.email + '"');
		if (previouslyAdded.length) {
			return false;
		}
		let insertQuery = 'INSERT INTO Users (id,name,email,password,mobile) VALUES(null,"' + user.name +'", "' + user.email + '", "' + user.nickname  + '", null )';

		let insertResult = await db.executeGenericQuery(insertQuery);
		if (insertResult.affectedRows) {
			return true;
		}
	} catch(err) {
		return err;
	}
}

// EXPORTS
exports.registerUser = registerUser;
