
const { randomBytes } = require('crypto');

exports.random_buffer = (length) => {
	return new Promise((resolve, reject) => {
		randomBytes(length, (error, buf) => {
			if (error) {
				return reject(error);
			}

			resolve(buf);
		});
	});
};
