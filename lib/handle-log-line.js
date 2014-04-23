var filterLogLine = require('./filter-log-line'),
    formatLogLine = require('./format-log-line');

module.exports = function handleLogLine(streamOut, opts, line) {
    var json;
    try {
        json = JSON.parse(line);
    } catch (e) {
    }

    if (!json) {
        if (!hasFilters(opts)) {
            streamOut.write(line + '\n');
        }
        return;
    }

    if (!filterLogLine(opts, json)) {
        return;
    }

    streamOut.write(formatLogLine(opts, json));
};

function hasFilters(opts) {
    return opts.events || opts.notEvents || opts.services || opts.notServices;
}
