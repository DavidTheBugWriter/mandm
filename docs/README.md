# hacking M & M page

## start webserver

cd to mandm directory;

do `elm reactor` to start elm webserver on port 8000

## M&M html files

### basket

basket html is under:
>\<div class=basketContent>

Basket items are in list with list items described by:

>\<div class=clearfix>

## todo

### system generated issues

* status goes red -> click my account -> 'issues' tab -> list of issues -> drop down on each item

* click order to show issue found

* click to find tracking data

### user generates issues

* goes to My Account -> My Orders -> Vew Order
* Generate a formatted email and send it

## impementation notes

(Not sure what Elm brings to the css party?)

Somewhere in target html file add:
>\<script src="davidselm.js">\</script>

and
> \<script>
    var app = Elm.Css1.init({ node: document.querySelector('davestag') })
  \</script>

  'davestag' is the target node for your Elm magic

## examples

lists:

[Basic html list](http://localhost:8000/lists.html)

[ellie lists](https://ellie-app.com/brM9ZvjJ9JXa1 )

[elm-lang example](https://elm-lang.org/examples)
