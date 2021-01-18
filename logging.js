const Log = require("./database/models/Log.js");

module.exports = class Log {
	async log(args) {
		const log_item = Log.create({
			date: args[0],
			time: args[1],
			user: args[3],
			channel: args[4],
			message: args[5]
		});
	}
}
