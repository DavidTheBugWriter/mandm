
module Main exposing (..)

{- 

There are a few elm-ui attributes you need:
onMouseEnter, onMouseLeave & below.
The idea is that you track the state of the menu in the model, 
toggling via messages from onMouseEnter/onMouseLeave, 
and then add/not add `below` attr with menu content accordingly.
-}

import Element exposing (Element, mouseOver, el, text, row, alignRight, fill, width, rgb255, spacing, centerY, padding)
import Element.Background as Background
import Element.Border as Border
import Element.Font as Font


main : Program () () Never
main =
    Browser.sandbox { 
    init = (), 
    view = \_ -> text makeStr, 
    update = \_ _ -> () 
    }


makeStr : String
makeStr =
    Debug.toString [ 1 ]

myRowOfStuff =
    row [ width fill, centerY, spacing 30 ]
        [ myElement
        , myElement
        , el [ alignRight ] myElement
        ]


myElement : Element msg
myElement =
    el
        [ Background.color (rgb255 240 0 245)
        , Font.color (rgb255 255 255 255)
        , Border.rounded 3
        , padding 30
        
        , mouseOver [Background.color (rgb255 120 0 234) ]
        ]
        (text "stylish!")