# decolog

A cli tool that you can pipe JSON log files into and get pretty output.

## Installation

```sh
npm install -g decolog
```


## Usage

```sh
$ decolog --help

  Usage: decolog [options]

  Options:

    -h, --help                         output usage information
    -V, --version                      output the version number
    -e, --events <events>              Only include these events
    -E, --not-events <not-events>      Do not include these events
    -s, --services <services>          Only include these events
    -S, --not-services <not-services>  Do not include these events
    -m, --minimal                      Only output one line per record, skipping extra fields

  If a file is specified, the file will be watched and all previous and future contents of the file will be decorated and outputted.
  If no file is specified stdin will be decorated and outputted.

  Examples:

    $ decorate-log temp/log
    $ tail -f temp/log | decorate-log
    $ cat temp/log | decorate-log -e request,response
```


## Expected log file format

The log file should consist of lines with JSON objects. Each line should have
(not restricted to) the following keys:

- `@timestamp`
- `event`
- `message`
- `groupId`
