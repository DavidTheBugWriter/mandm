# Experiments relating to MandM

We playing with a single page app - SPA

## getting json server running

start a json server on a different port:

`json-server  --watch orders.json  -p 5016

or if orders are in a different folder:

json-server --watch server/orders.json -p 5016 --delay 1000

## start the react server

`elm reactor --port=8001

You can now watch the elm file _directly_ & without an html file:

`localhost:8000

## libraries

you might need to install elm json decode for json pipe goodness |>

`elm install NoRedInk/elm-json-decode-pipeline
