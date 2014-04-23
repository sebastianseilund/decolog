var handleLogLine = require('./handle-log-line');

module.exports = function processStream(streamIn, streamOut, opts) {
    var leftover = '';  // Left-over partial line from last chunk.
    streamIn.resume();
    streamIn.setEncoding('utf8');
    streamIn.on('data', function (chunk) {
        var lines = chunk.split(/\r\n|\n/);
        var length = lines.length;
        if (length === 1) {
            leftover += lines[0];
            return;
        }

        if (length > 1) {
            handleLogLine(streamOut, opts, leftover + lines[0]);
        }
        leftover = lines.pop();
        length -= 1;
        for (var i = 1; i < length; i++) {
            handleLogLine(streamOut, opts, lines[i]);
        }
    });
    streamIn.on('end', function () {
        if (leftover) {
            handleLogLine(streamOut, opts, leftover);
            leftover = '';
        }
    });
};
