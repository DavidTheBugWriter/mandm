module Issues exposing (main, Order, orderDecoder, ordersDecoder)

{-
problems:
https://www.reddit.com/r/elm/comments/b4ao63/trouble_with_extracting_parsing_url_fragment/
-}

{- currently we take an queryorder hardcoded from the HTML page. Need to change 
so the orderID is grabbed from the URL-}

import Html exposing (Html)
import Browser
import Element exposing (Element, rgb255, spacing, padding,el, row,  fill)
import Element.Font as Font
import Http exposing (..)
import Json.Decode as Decode exposing (Decoder, int, float, list, string)
import Json.Decode.Pipeline exposing (required)
import RemoteData exposing ( WebData)
import Url exposing (..)
import Url.Parser as P exposing (Parser, (</>), (<?>), s, top)
import Url.Parser.Query as Q
-- import Dict exposing (Dict)
-- import QS


-- route URLs to handlers
type Route
    = Home
    --| GetOrder Int
    | OrderQuery (Maybe Int)

type Msg
    = FetchOrders
    | OrdersReceived (WebData (List Order))

type alias Model = { orders : WebData (List Order), pageurl : String, queryorder : QueryOrder}

type QueryOrder  = OrderList (List Int)  | NoOrders

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

{- Json Decoder for a list of type Order -}
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

{- extract list of queryorder numbers we're interested in from the inbound referring Url -}
urlorderlist : Model -> QueryOrder
urlorderlist model = 
    case Url.fromString model.pageurl of
            Nothing ->
                NoOrders
            Just url ->
                Maybe.withDefault NoOrders (Just (extractorders url.query))
   -- case modelurl of
   --    Just u -> P.parse (s "src" </> s "Main.elm" <?> (Q.custom "post" (List.filterMap String.toInt))) u 
   --    Nothing -> Just [] 

-- parse url query string & if not empty get orders
extractorders : Maybe String -> QueryOrder --List Int 
extractorders query =
    case query of 
        Nothing -> NoOrders
        Just querystring ->
          parsequery querystring --    NoOrders --TODO write this bit...

parsequery : String -> QueryOrder
parsequery string =
    NoOrders
routeParser : Parser (Route -> a) a
routeParser =
    P.oneOf
        [ P.map Home top
        --, P.map GetOrder (s "" </> P.int)
        , P.map OrderQuery (s "" <?> Q.int "q") -- Just (OrderQuery (Just "12028383"))
        ]

queryParser : Q.Parser (List Int)
queryParser =
  Q.custom "queryorder" (List.filterMap String.toInt)

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
        case model.queryorder of
            OrderList list ->
                row[] (List.map (\x -> row[] ([viewOutput model x])) list)
            NoOrders ->
                row[][]
        -- row[]([viewOutput model])
    ]

viewOutput : Model -> Int -> Element Msg
viewOutput model queryorder =
    case model.orders of
        RemoteData.NotAsked ->
            Element.text ""

        RemoteData.Loading ->
            Element.text "Loading..."

        RemoteData.Success orders ->
            viewOrders (extract queryorder orders)

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
                    \queryorder -> 
                        el itemfmt <| Element.text (String.fromInt queryorder.customerid)
                }
                , { header = colheadertext "Order ID"
                    , width = fill
                    , view =  
                        \queryorder -> 
                            el itemfmt <| Element.text (String.fromInt queryorder.orderid )
                }                
                , { header = colheadertext "Shipping"
                    , width = fill
                    , view =  
                        \queryorder -> 
                            el itemfmt <| Element.text (String.fromFloat queryorder.shipping )
                }
                , { header = colheadertext "Total"
                    , width = fill
                    , view =  
                        \queryorder -> 
                            el itemfmt <| Element.text (String.fromFloat queryorder.total )
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
            "Couldn't fetch JSON data at this time."
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
    ( 
        {--}
        { orders = RemoteData.Loading,
        pageurl =  flags.flagurl, 
        queryorder =  NoOrders --TODO needs to be stuffz urlorderlist flags.flagurl
        }
        
        --Model RemoteData.Loading "" NoOrders
    , 
    fetchOrders )

main : Program Flags Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = \_ -> Sub.none
        }