import { TablerIcon } from "@tabler/icons"

enum Events
{
  JOIN_ROOM = "JOIN_ROOM",
  JOIN_ROOM_UPDATE = "JOIN_ROOM_UPDATE",
  LEAVE_ROOM = "LEAVE_ROOM",
  LEAVE_ROOM_UPDATE = "LEAVE_ROOM_UPDATE",
  SEND_MESSAGE = "SEND_MESSAGE",
  SEND_MESSAGE_UPDATE = "SEND_MESSAGE_UPDATE",
  DISSCONNECT = "disconnect", //reserved name for socketIO
  VIDEO_SEEK = "VIDEO_SEEK",
  VIDEO_SEEK_UPDATE = "VIDEO_SEEK_UPDATE",
  VIDEO_PLAY = "VIDEO_PLAY",
  VIDEO_PLAY_UPDATE = "VIDEO_PLAY_UPDATE",
  VIDEO_PAUSE = "VIDEO_PAUSE",
  VIDEO_PAUSE_UPDATE = "VIDEO_PAUSE_UPDATE",
  GET_ROOM_DATA = "GET_ROOM_DATA",
  GET_ROOM_DATA_UPDATE = "GET_ROOM_DATA_UPDATE",
}

enum QueryParams
{
  RETURN_URL = "returnUrl",
}

enum Brands
{
  DISCORD = "Discord",
  GOOGLE = "Google",
}

enum LinkTypes
{
  PROFILE = "PROFILE",
  DEFAULT = "DEFAULT",
}

enum EndPoints
{
  USER = "/api/profile/user",
  ROOM = "/api/rooms",
  VIDEO = "/api/videos",
  VIDEO_STREAM = "/api/videos/stream",
  USER_SEARCH = "/api/users/search",
}

enum SearchType
{
  Room = "SEARCH_ROOM",
  Video = "SEARCH_VIDEO",
}

enum Helpers
{
  VideoStartPath = "./videos"
}

export { Events, QueryParams, Brands, EndPoints, LinkTypes, SearchType, Helpers }