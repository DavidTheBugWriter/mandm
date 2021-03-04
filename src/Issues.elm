module Issues exposing (main, Order, orderDecoder, ordersDecoder)

import Html exposing (Html)
import Browser
import Element exposing (Element, rgb255, spacing, padding,el, row,  fill)
import Element.Font as Font
import Http exposing (expectJson)
import Json.Decode as Decode exposing (Decoder, int, float, list, string)
import Json.Decode.Pipeline exposing (required)
import RemoteData exposing ( WebData)
import Url exposing (Url)
import Url.Parser as P exposing (Parser, (</>), (<?>), s, top)
import Url.Parser.Query as Q

-- route URLs to handlers
type Route
    = Home
    | GetOrder Int

type Msg
    = FetchOrders
    | OrdersReceived (WebData (List Order))

type alias Model = { orders : WebData (List Order), pageurl : String, order : Int}

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

type alias Flags =
    { flagorder: Int,
     flagurl: String
    }

-- functions for styling 
itemfmt : List (Element.Attribute msg)
itemfmt = [ spacing 10, padding 10]
itemcolfmt : List (Element.Attr () msg)
itemcolfmt = [ Font.color (rgb255 0 0 255), spacing 10, padding 10]

colheadertext : String -> Element msg
colheadertext msg =
    Element.el (itemfmt ++ [Font.color (rgb255 255 0 0)])(Element.text msg)

tableitemtext : (a  -> String ) -> a -> Element msg
tableitemtext formatterf msg =
    Element.el itemfmt (Element.text (formatterf msg))

{- Decoder for a list of type Order -}
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

extract : Int -> (List Order) -> List Order
extract wanted orders = 
    List.filter (\x -> x.orderid == wanted) orders

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
    Element.layout[Font.size 12]
    <| Element.column[]
    [                       
        row[]([viewOutput model  model.order])        
        -- row[]([viewOutput model])
    ]

viewOutput : Model -> Int -> Element Msg
viewOutput model order =
    case model.orders of
        RemoteData.NotAsked ->
            Element.text ""

        RemoteData.Loading ->
            Element.text "Loading..."

        RemoteData.Success orders ->
            viewOrders (extract order orders)

        RemoteData.Failure httpError ->
            viewError (errorMessage httpError)

viewOrders : List Order -> Element Msg
viewOrders orders =
    let 
        items = List.head orders
        itemlist = case items of
            Just l -> l.items
            _ -> []
    in
    Element.column[]
    [
        Element.table [] --ORDER TABLE
        {
        data = orders --orders
        , columns =
            [
                { -- header = el [ spacing 10, padding 10 ] <| Element.text "Customer ID"
                header = colheadertext "Customer ID"
                , width = fill
                , view =  
                    \order -> 
                        el itemfmt <| Element.text (String.fromInt order.customerid)
                }
                , { header = colheadertext "Order ID"
                    , width = fill
                    , view =  
                        \order -> 
                            el itemfmt <| Element.text (String.fromInt order.orderid )
                }                
                , { header = colheadertext "Shipping"
                    , width = fill
                    , view =  
                        \order -> 
                            el itemfmt <| Element.text (String.fromFloat order.shipping )
                }
                , { header = colheadertext "Total"
                    , width = fill
                    , view =  
                        \order -> 
                            el itemfmt <| Element.text (String.fromFloat order.total )
                }
            ]    
        }
        , Element.table[] -- ITEMS table
            {
            data = itemlist
            , columns =
                [
                    { header = el itemcolfmt <| Element.text "Product Code"
                    , width = fill
                    , view =  
                        \item -> 
                            el itemfmt <| Element.text item.sku
                    }
                ,    { header = el itemcolfmt <| Element.text "Description"
                    , width = fill
                    , view =  
                        \item -> 
                            el itemfmt <| Element.text item.description
                    }
                ,   { header = el itemcolfmt <| Element.text "Price"
                    , width = fill
                    , view =  
                        \item -> 
                            tableitemtext String.fromFloat item.price
                    }
                ,   { header = el itemcolfmt <| Element.text "Saving"
                    , width = fill
                    , view =  
                        \item -> 
                            tableitemtext String.fromFloat item.saving
                    }
                ,   { header = el itemcolfmt <| Element.text "Stock"
                    , width = fill
                    , view =  
                        \item -> 
                            tableitemtext String.fromInt item.stock
                    }
                ]
        }
    ]

viewError : String -> Element Msg
viewError message =
    let
        errorHeading =
            "Couldn't fetch data at this time."
    in
         Element.text ("Error: " ++ errorHeading++" ; "++ message)

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

init : Flags -> ( Model, Cmd Msg )
init flags =
    ( { orders = RemoteData.Loading, pageurl = flags.flagurl, order = flags.flagorder }, fetchOrders )

main : Program Flags Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = \_ -> Sub.none
        }