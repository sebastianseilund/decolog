var fs = require('fs')
var util = require('util')
var Readable = require('stream').Readable

function FollowStream(file) {
	if (!(this instanceof FollowStream)) {
		return new FollowStream(opts)
	}

	Readable.call(this)
	this._file = file
	this._pos
}

util.inherits(FollowStream, Readable)

module.exports = FollowStream

FollowStream.prototype._read = function(size) {
	var self = this
	if (!this._fd) {
		fs.open(this._file, 'r', function(err, fd) {
			if (err) {
				self.emit('error', err)
				return
			}
			self._fd = fd
			self._read(size)
			fs.watch(self._file, function() {
				self.read(0)
				// self.push('')
			})
		});
		return
	}

	var buf = new Buffer(size)
	buf.fill(0)
	fs.read(this._fd, buf, 0, buf.length, null, function(err, bytesRead, buf1) {
		if (err) {
			self.emit('error', err)
		} else {
			if (bytesRead > 0) {
				self.push(buf.slice(0, bytesRead))
			} else {
				self.push('')
			}
		}
	})
}
