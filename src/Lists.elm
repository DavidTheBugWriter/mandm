module Lists exposing (..)
import Html exposing (..)


main =
  div []
    [ h1 [] [ text "Lists in Elm" ]
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