module Post exposing (main, Order, orderDecoder, ordersDecoder)

-- https://github.com/pawanpoudel/beginning-elm-code/blob/master/chapter-7/7.4-creating-post-module/beginning-elm/post-app/Post.elm

-- Json Decoders:
-- https://www.jackfranklin.co.uk/blog/json-decoding-in-elm/
-- https://www.brianthicks.com/post/2016/10/17/composing-decoders-like-lego/
-- https://www.artificialworlds.net/blog/2018/10/19/elm-json-decoder-examples/

import Html exposing (Html, button, div, text, h3, table, thead, tr, th, td)
-- import Html.Attributes exposing (style)
import Browser
import Html.Events exposing (onClick)
import Http exposing (expectJson)
import Json.Decode as Decode exposing (Decoder, int, float, list, string)
import Json.Decode.Pipeline exposing (required)
import RemoteData exposing (RemoteData, WebData)
-- import Html exposing (thead)
-- import Svg.Styled.Attributes exposing (order)

type Msg
    = FetchOrders
    | OrdersReceived (WebData (List Order))

type alias Model = { orders : WebData (List Order)}
type alias Item =
    { sku : String
    , description : String
    , size : String
    , price : Float
    , saving : Float
    , stock : Int  --TODO needs to be a type
    }

type alias Order =
    { customerid : Int
    , orderid : Int
    , items : (List Item)
    , shipping : Float
    , total : Float
    }

{- Decoder for a list of type Post -}
ordersDecoder : Decoder (List Order)
ordersDecoder =
    let y = orderDecoder
    in
        --list is a built-in Json.Decoder list decoder , found decoder (List Order)
    list y
orderDecoder : Decoder Order
orderDecoder = 
    Decode.succeed Order
    |> required "customerid" int
    |> required "orderid" int
    |> required "items" (list itemDecoder)
    |> required "shipping" float
    |> required "total" float

itemDecoder : Decoder Item
itemDecoder = 
    Decode.succeed Item
    |> required "sku" string
    |> required "description" string
    |> required "size" string
    |> required "price" float
    |> required "saving" float
    |> required "stock" int

view : Model -> Html Msg
view model =
    viewOutput model


viewOutput : Model -> Html Msg
viewOutput model =
    case model.orders of
        RemoteData.NotAsked ->
            text ""

        RemoteData.Loading ->
            h3 [] [ text "Loading..." ]

        RemoteData.Success orders ->
            viewOrders orders

        RemoteData.Failure httpError ->
            viewError (errorMessage httpError)

viewOrders : List Order -> Html Msg
viewOrders orders =
    let 
        printorder = List.map(\c -> viewOrder c) orders
    in
    div []
        [ h3 [] [ text "Orders" ]
        , table []
        (
        printorder
        )
        ]

viewOrder : Order -> Html Msg
viewOrder o =
    table[]
    [
        orderHeader
        ,tr[]
        [
        td[][text (String.fromInt o.customerid)]
        , td[][text (String.fromInt o.orderid)]
        , td[][text (String.fromFloat o.shipping)]
        , td[][text (String.fromFloat o.total)]
        ]
        , viewTableHeader
        , viewItems o.items    
    ]

viewItem : Item -> Html Msg
viewItem i =
    tr[]
    [
    td[][text i.sku]
    , td[][text i.description]
    , td[][text i.size]
    , td[][text (String.fromFloat i.price)]
    , td[][text (String.fromFloat i.saving)]
    ]
viewItems : List Item -> Html Msg
viewItems li =
   --r1
   tr[]
   (List.map (\x -> viewItem x) li)

viewError : String -> Html Msg
viewError message =
    let
        errorHeading =
            "Couldn't fetch data at this time."
    in
    div []
        [ h3 [] [ text errorHeading ]
        , text ("Error: " ++ message)
        ]

errorMessage : Http.Error -> String
errorMessage httpError =
    case httpError of
        Http.BadUrl message ->
            message

        Http.Timeout ->
            "Server is taking too long to respond. Please try again later."

        Http.NetworkError ->
            "Unable to reach server."

        Http.BadStatus statusCode ->
            "Request failed with status code: " ++ String.fromInt statusCode

        Http.BadBody message ->
            message

orderHeader : Html Msg
orderHeader =
    thead[][
        td[][text "Customer ID"]
        , td[][text "Order ID"]
        , td[][text "Shipping"]
        , td[][text "Total"]
    ]

viewTableHeader : Html Msg
viewTableHeader =
    th []
        [ td []
            [ text "Item description" ]
        , td []
            [ text "Size" ]
        , td []
            [ text "Quantity" ]
        , td []
            [ text "Savings" ]
        , td []
            [ text "Price" ]
        ]

fetchOrders : Cmd Msg
fetchOrders =
    Http.get
        { url = "http://localhost:5016/orders"
        , expect =
            list orderDecoder
                |> Http.expectJson (RemoteData.fromResult >> OrdersReceived)
        }

update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        FetchOrders ->
            ( { model | orders = RemoteData.Loading }, fetchOrders )

        OrdersReceived response ->
            ( { model | orders = response }, Cmd.none )

init : () -> ( Model, Cmd Msg )
init _ =
    ( { orders = RemoteData.Loading }, fetchOrders )

main : Program () Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = \_ -> Sub.none
        }