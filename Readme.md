#Node Wiki

A simple wiki system using markdown files.

## Install

Clone this repo, navigate to it on the command line, then run:

```
npm install -g
```

## Usage

    nodewiki [port]

Node Wiki can be started on any directory. To start it, simply type
`nodewiki` in the directory that you want to start it in. Without any
options, the URL for node wiki would be: http://localhost:3000/
and any other computer on the network can access the wiki (subject to
firewall settings). To specify the port, give it as the first 
argument on the command line.

###Examples

```
nodewiki
``` 
Starts node wiki

```
nodewiki 7777
```
Starts node wiki on port 7777
