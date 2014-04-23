var colors = require('colors'),
    moment = require('moment');

module.exports = function formatLogLine(opts, json) {
    var timestamp = json['@timestamp'],
        groupId = json.groupId,
        event = json.event,
        service = json.service,
        message = json.message,
        hostname = json.hostname;

    delete json['@timestamp'];
    delete json.groupId;
    delete json.event;
    delete json.service;
    delete json.message;
    delete json.hostname;

    var data = '[' + moment(timestamp).format('YYYY-MM-DD HH:mm:ss') + '] ' + service + ' on ' + hostname + ': ' + (colors.magenta(event)) + ' ' + colors.cyan(message) + ' ' + colors.grey(groupId) + '\n';
    if (!opts.minimal) {
        data += formatJson(json) + '\n';
    }

    return data;
};

function formatJson(json) {
    json = JSON.stringify(json, null, '  ');
    json = json.replace(/^\{\n?/, '');
    json = json.replace(/\n?\}$/, '');
    json = json.replace(/,\n/g, '\n');
    json = colors.grey(json);
    return json;
}
