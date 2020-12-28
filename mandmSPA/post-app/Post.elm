module Post exposing (Post, PostId, postDecoder, postsDecoder, idToString)

-- https://github.com/pawanpoudel/beginning-elm-code/blob/master/chapter-7/7.4-creating-post-module/beginning-elm/post-app/Post.elm

-- Json Decoders:
-- https://www.jackfranklin.co.uk/blog/json-decoding-in-elm/
-- https://www.brianthicks.com/post/2016/10/17/composing-decoders-like-lego/
-- https://www.artificialworlds.net/blog/2018/10/19/elm-json-decoder-examples/

import Json.Decode as Decode exposing (Decoder, int, list, string)
import Json.Decode.Pipeline exposing (required)


type alias Post =
    { id : PostId
    , title : String
    , authorName : String
    , authorUrl : String
    }

type PostId -- opaque type that's exposed
    = PostId Int
{- Decoder for a list of type Post -}
postsDecoder : Decoder (List Post)
postsDecoder =
    list postDecoder  --list is a built-in Json.Decoder list decoder 

{- get custom decoder function for custom type -}
idDecoder : Decoder PostId
idDecoder =
    Decode.map PostId int

--postDecoder : Decoder Post  --decoder for Post
postDecoder : Decoder Post
postDecoder =
    Decode.succeed Post
        |> required "id" idDecoder
        |> required "title" string
        |> required "authorName" string
        |> required "authorUrl" string

-- used for viewing view posts
idToString : PostId -> String
idToString postId =
    case postId of
        PostId id ->
            String.fromInt id
    