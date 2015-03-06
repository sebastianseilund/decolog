var util = require('util')
var Transform = require('stream').Transform
var colors = require('colors')
var moment = require('moment')

function LogDecorator(opts) {
	if (!(this instanceof LogDecorator)) {
		return new LogDecorator(opts)
	}

	Transform.call(this)
	this._opts = opts || {}
	this._leftover = ''  // Left-over partial line from last chunk.
}

module.exports = LogDecorator

util.inherits(LogDecorator, Transform)

LogDecorator.prototype._transform = function(chunk, encoding, done) {
	var lines = chunk.toString().split(/\r\n|\n/)
	var length = lines.length
	if (length === 1) {
		this._leftover += lines[0]
		return
	}

	if (length > 1) {
		this._handleLogLine(this._leftover + lines[0])
	}
	this._leftover = lines.pop()
	length -= 1
	for (var i = 1; i < length; i++) {
		this._handleLogLine(lines[i])
	}
	done()
}

LogDecorator.prototype._handleLogLine = function(line) {
	var json
	try {
		json = JSON.parse(line)
	} catch (e) {
	}

	if (!json) {
		if (!this._hasFilters()) {
			this.push(line + '\n')
		}
		return
	}

	if (!this._filterLogLine(json)) {
		return
	}

	this.push(this._formatLogLine(json))
}

LogDecorator.prototype._hasFilters = function() {
	var opts = this._opts
	return opts.events || opts.notEvents || opts.services || opts.notServices
}

LogDecorator.prototype._filterLogLine = function(json) {
	var opts = this._opts

	if (opts.events && opts.events.indexOf(json.event) === -1) {
		return false
	}

	if (opts.notEvents && opts.notEvents.indexOf(json.event) !== -1) {
		return false
	}

	if (opts.services && opts.services.indexOf(json.service) === -1) {
		return false
	}

	if (opts.notServices && opts.notServices.indexOf(json.service) !== -1) {
		return false
	}

	return true
}

LogDecorator.prototype._formatLogLine = function(json) {
	var opts = this._opts

	var timestamp = json['@timestamp']
	var groupId = json.groupId || ''
	var event = json.event || ''
	var service = json.service || ''
	var message = json.message || ''
	var hostname = json.hostname || ''

	delete json['@timestamp']
	delete json.groupId
	delete json.event
	delete json.service
	delete json.message
	delete json.hostname
	delete json.level

	if (!event && json.type) {
		event = json.type
		delete json.type
	}

	var data = '[' + moment(timestamp).format('YYYY-MM-DD HH:mm:ss') + '] ' + (colors.magenta(event)) + ' ' + colors.cyan(message) + ' ' + colors.grey(groupId) + '\n'
	if (!opts.minimal) {
		data += formatJson(json) + '\n'
	}

	return data
}

function formatJson(json) {
	json = JSON.stringify(json, null, '  ')
	json = json.replace(/^\{\n?/, '')
	json = json.replace(/\n?\}$/, '')
	json = json.replace(/,\n/g, '\n')
	json = colors.grey(json)
	return json
}
