export enum Events {
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
}