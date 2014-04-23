#billy-log-parser

A cli tool that you can pipe JSON log files into and get pretty output.

##Installation

```sh
npm install -g billy-log-parser
```


##Usage

```sh
$ billy-log-parser --help

  Usage: billy-log-parser [options]

  Options:

    -h, --help                         output usage information
    -V, --version                      output the version number
    -e, --events <events>              Only include these events
    -E, --not-events <not-events>      Do not include these events
    -s, --services <services>          Only include these events
    -S, --not-services <not-services>  Do not include these events
    -m, --minimal                      Only output one line per record, skipping extra fields

  Examples:

    $ tail -f temp/log | billy-log-parser
    $ cat temp/log | billy-log-parser -e request,response
```


##Expected log file format

The log file should consist of lines with JSON objects. Each line should have
(not restricted to) the following keys:

- `@timestamp`
- `service`
- `hostname`
- `event`
- `message`
- `groupId`
