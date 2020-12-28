module Main exposing (main)

import Browser
import Html exposing (..)
import Html exposing (Html, button, div, text)
import Html.Attributes exposing (href)
import Html.Events exposing (onClick)

import Http
import Json.Decode as Decode exposing (Decoder, int, list, string)
import Json.Decode.Pipeline exposing (required)
import RemoteData exposing (RemoteData, WebData)

import Json.Decode as D
import Json.Encode as E


type alias Model =
    { 
    orders : WebData (List Order),
    datacategory: String
    }

type alias MyRecord = {i: Int, s: String}

initialModel : Model
initialModel =
    { orders = RemoteData.Loading, datacategory = "Unknown"}


type Msg
    = FetchOrders
    | OrdersReceived (WebData (List Order))

--===========================

-- '2' in map2 below since 2 fields
myRecordDecoder = D.map2 MyRecord (D.field "i" D.int) (D.field "s" D.string)

-- normal string to Json
fuckit =E.encode 0 feck
feck = E.string "Order Screen"

type alias Order =
    {
    id : Int
    , cust : Int
    , items : List String
    , shipping : Float
    , total : Float}
    
orderDecoder =
    D.map5 
    Order
    (D.at ["id"] D.int)
    (D.at ["cust"] D.int)
    (D.at ["items"] (D.list D.string))
    (D.at ["shipping"] D.float)
    (D.at ["total"] D.float)

o1 = Order 1701388 90828272 ["one","two"] 34 231.46

-- orderDecoder =D.map (\name -> { name = name })  (D.at ["name"] D.string)
makeOrderRow orderItems =
    List.map (\n -> (tr [][(text n)])) orderItems

{- fetch data and generate message & the 'response' data payload
  '>>' : func1 >> func2 equiv: \param -> func2 (fun1 param) so pipe list 
  elements got from http.get url through orderDecoder and built list on
  end of ORdersReceived message
-}
fetchOrders : Cmd Msg 
fetchOrders =
    Http.get
        { url = "http://localhost:5019/orders"
        , expect =
            list orderDecoder 
                |> Http.expectJson (RemoteData.fromResult >> OrdersReceived)
        }

viewOrders : List Order -> Html Msg
viewOrders orders =
    div []
        [ h3 [] [ text "Orders" ]
        , table []
            ([ viewTableHeader ] ++ List.map viewOrder orders)
        ]

viewTableHeader : Html Msg
viewTableHeader =
    tr []
        [ th []
            [ text "ID" ]
        , th []
            [ text "Customer" ]
        , th []
            [ text "Items" ]
        , th []
            [ text "Shipping" ]
        , th []
            [ text "Total" ]            
        ]

viewOrder : Order -> Html Msg
viewOrder order =
    tr []
        [ td []
            [ text (String.fromInt order.id) ]
        , td []
            [ text (String.fromInt order.cust) ]
        , td []
            (makeOrderRow order.items)
        , td []
            [ text (String.fromFloat order.shipping) ]
        , td []
            [ text (String.fromFloat order.total) ]
            
        ]
--==========================
-- view either orders or the fetch error   
--TODO generalise this from orders to other categories:  returns etc etc
viewOutput : Model -> Html Msg
viewOutput model =
    case model.orders of
        RemoteData.NotAsked ->
            text "No orders asked for."
        RemoteData.Loading ->
            h3 [] [ text "Loading..." ]
        RemoteData.Success orders ->
            viewOrders orders      
        RemoteData.Failure httpError ->
            viewError  model.datacategory (buildErrorMessage httpError)

viewError : String -> String -> Html Msg
viewError dataerror errorMessage =
    let
        errorHeading =
            "'"++dataerror++"': Couldn't fetch data at this time."
    in
    div []
        [ h3 [] [ text errorHeading ]
        , text ("Error: " ++ errorMessage)
        ]

buildErrorMessage : Http.Error -> String
buildErrorMessage httpError =
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


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        FetchOrders ->
            ({ model | orders =  RemoteData.Loading, 
               datacategory ="Orders" }, fetchOrders )
        OrdersReceived response ->
            ( { model | orders = response }, Cmd.none )

init : () -> ( Model, Cmd Msg )
init _ =
    ( { orders = RemoteData.NotAsked, datacategory = "No Data category" }, Cmd.none )

view : Model -> Html Msg
view model =
    div []
        [ 
        div[][text fuckit]
        , button [ onClick FetchOrders ] [ text "get orders" ]
        , div [][viewOutput model]
        ]


main : Program () Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = \_ -> Sub.none
        }
