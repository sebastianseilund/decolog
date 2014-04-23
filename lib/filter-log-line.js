module.exports = function filterLogLine(opts, json) {
    if (opts.events && opts.events.indexOf(json.event) === -1) {
        return false;
    }

    if (opts.notEvents && opts.notEvents.indexOf(json.event) !== -1) {
        return false;
    }

    if (opts.services && opts.services.indexOf(json.service) === -1) {
        return false;
    }

    if (opts.notServices && opts.notServices.indexOf(json.service) !== -1) {
        return false;
    }

    return true;
};
