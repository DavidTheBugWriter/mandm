module Dropcheckbox1 exposing (..)
--module Main exposing (main)

import Browser
import Element exposing (rgb255, rgb, padding,el)
import Element.Border
import Element.Events
import Element
import Element.Font exposing (..)
import Element.Font as Font
import Element.Background
import Html exposing (Html, div, text)
import Html.Attributes
import Html.Events exposing (onClick)
import Element.Input as Input
import String exposing (right)
import Html.Attributes exposing (align)


{- This creates an Elm-UI text element that highlights on hover
   and provides a skeleton for copy/pasting text.
   It needs to be hooked into some other mechanism for
   actually placing the copied text in the clipboard.
-}

-- state
type alias Model =
    {
    mouseEntered : Bool
    , checkBox: Bool
    }

{-
type alias Form =
    { 
     checkBox : Bool
    }
-}
-- initial state
initialModel : Model
initialModel =
    {
    mouseEntered  = False
    , checkBox = False
    }


-- mouse event messages
{- type alias Checkbox =
    { 
     checkBox : Bool
    } -}
    
type Msg 
    = Enter
    | Leave
    | Update Model


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
        Update  checkboxvalue ->
            { model | checkBox = checkboxvalue.checkBox } 
          


view : Model -> Html Msg
view model =

      {-   div [] [ 
             mouseDropText "Some Text" "Drop Text" model
             , text "next line"
             ] -}
              
   Element.layout
        [Font.size 12
        , Element.spacing 50
        , Element.Font.wordSpacing 0
        , padding 8]
          
          --<| mouseDropText "Stuff" "Drop Text" model
          
        <| Element.row[]
        [ 
         Element.text "15 May 2020"  
         , Input.checkbox [padding 8, Font.color errCbRed]
                { checked = model.checkBox
                , onChange = \new -> Update { model | checkBox = new }
                , icon = Input.defaultCheckbox
                , label = Input.labelRight [] (Element.text "Order problems")
                }

         ,  Element.text "Dispatched"  

         --, mouseDropText "Stuff" "Drop Text" mode
         , Element.link[padding 8, Element.spacing 50, Font.size 12, Font.color insurelloBlue]{
             label = el [alignRight](Element.text "View my order")
             , url = "http://localhost:8000/issues.html"
            }
        ]
    {-   ,[
         Element.link[padding 8, Element.spacing 50, Font.size 12, Font.color insurelloBlue]{
             label = el [alignRight](Element.text "Continue")
             , url = "http://localhost:8000/issues.html"
            }
        ]
    -}

insurelloBlue : Element.Color
insurelloBlue =
    rgb255 59 139 186

errCbRed : Element.Color
errCbRed =
    rgb255 204 0 0
{-dropFontAttr :  Font
dropFontAttr = 
    size 18 -}


{- need an arity/1 version -}
mouseDropText :  String -> String -> Model -> Element.Element Msg
mouseDropText thetext droptext model =
    Element.el
        [ Element.Events.onMouseEnter Enter {-  -}
        , Element.Events.onMouseLeave Leave {-  -}
        , Element.Border.rounded 10
        , Element.padding 10
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
        (Element.text thetext)
        --|> Element.layout []




main : Program () Model Msg
main =
    Browser.sandbox
        { init = initialModel
        , view = view
        , update = update
        }