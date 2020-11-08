module Css1 exposing (main)
{- Don't forget to use Css1 in html for init -}
import Browser
import Css exposing (..)
import Html
import Html.Styled exposing (..)
import Html.Styled.Attributes exposing (css, href, src)
import Html.Styled.Events exposing (onClick)


{-| A logo image, with inline styles that change on hover.
-}
logo : Html msg
logo =
    img
        [ src "logo.png"
        , css
            [ display inlineBlock
            , padding (px 20)
            , border3 (px 5) solid (rgb 120 120 120)
            , borderRadius (px 5)
            , hover
                [ borderColor theme.primary
                , borderRadius (px 10)
                ]
            ]
        ]
        []


{-| A plain old record holding a couple of theme colors.
-}
theme : { secondary : Color, primary : Color }
theme =
    { primary = hex "55af6a"
    , secondary = rgb 250 240 230
    }


{-| A reusable button which has some styles pre-applied to it.
-}
btn : List (Attribute msg) -> List (Html msg) -> Html msg
btn =
    styled button
        [ margin (px 12)
        , color (rgb 250 250 250)
        , hover
            [ backgroundColor theme.primary
            , textDecoration underline
            ]
        ]

view : Model -> Html Msg
view model =
    nav []
        [ 
          p [][text "Experiments with HTML and css"]
        {- img [ src "foo/david.jpg", css [ width (pct 100) ] ] [] -}
        , btn [ onClick DoSomething ] [ text "Click me!" ]
        , h1 [] [ text "Lists in Elm" ]
        , h2 [] [ text "My Grocery List" ]
        , ul []
        [ li [] [ text "Black Beans" ]
        , li [] [ text "Limes" ]
        , li [] [ text "Greek Yogurt" ]
        , li [] [ text "Cilantro" ]
        , li [] [ text "Honey" ]
        , li [] [ text "Sweet Potatoes" ]
        , li [] [ text "Cumin" ]
        , li [] [ text "Chili Powder" ]
        , li [] [ text "Quinoa" ]
        ]
        ]

main : Program () Model Msg
main =
    Browser.sandbox
        { view = view >> toUnstyled
        , update = update
        , init = initialModel
        }


update : Msg -> Model -> Model
update msg model =
    model


type Msg
    = DoSomething


type alias Model =
    ()


initialModel : Model
initialModel =
    ()