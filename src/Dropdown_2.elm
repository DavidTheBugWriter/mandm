module Dropdown_2 exposing (main)

import Browser
import Element exposing (rgb255, rgb, padding)
import Element.Border
import Element.Events
import Element
import Element.Font exposing (..)
import Element.Background
import Html exposing (Html, div, text)
import Html.Attributes
import Html.Events exposing (onClick)



{- This creates an Elm-UI text element that highlights on hover
   and provides a skeleton for copy/pasting text.
   It needs to be hooked into some other mechanism for
   actually placing the copied text in the clipboard.
-}

-- state
type alias Model =
    {
    mouseEntered : Bool
    }

-- initial state
initialModel : Model
initialModel =
    {
    mouseEntered = False
    }


-- mouse event messages
type Msg 
    = Enter
    | Leave


type MenuDropState
    = Dropped
    | UnDropped



update : Msg -> Model -> Model
update msg model =
    case msg of
        Enter ->
            -- Debug.log "enter" model {- todo: toggle state -}
            { model | mouseEntered = True }
        Leave ->
            --Debug.log "leave" model
           { model | mouseEntered = False } -- ?


view : Model -> Html Msg
view model =
         div [] [ 
             mouseDropText "Some Text" "Drop Text" model
             , text "next line"
             ]


insurelloBlue : Element.Color
insurelloBlue =
    rgb255 59 139 186


{-dropFontAttr :  Font
dropFontAttr = 
    size 18 -}


{- need an arity/1 version -}
mouseDropText :  String -> String -> Model -> Html Msg
mouseDropText thetext droptext model =
    Element.el
        [ Element.Events.onMouseEnter Enter {-  -}
        , Element.Events.onMouseLeave Leave {-  -}
        , Element.Border.rounded 3
        , Element.padding 3
        , Element.pointer
        , Element.htmlAttribute
            (Html.Attributes.style "user-select" "none")
        , Element.mouseOver
            [ Element.Border.color insurelloBlue
            , Element.Border.glow insurelloBlue 1
            , Element.Border.innerGlow insurelloBlue 1
            ]
        , Element.mouseDown [ Element.alpha 0.6 ]
        , Element.below (
                if model.mouseEntered then 
                    --Element.text "I'm below 2!"
                        Element.el
                        [ Element.Background.color (rgb 1.00 0.61 0.03)
                        , Element.Border.color (rgb 0 0.7 0)
                        , padding 10
                        ]
                        (Element.text droptext)
                 else
                     Element.none) 
        ]
        (
        Element.text thetext)
        |> Element.layout []




main : Program () Model Msg
main =
    Browser.sandbox
        { init = initialModel
        , view = view
        , update = update
        }