/**
 * 事件常量定义
 */


// video原生事件
export const EVENT_CANPLAY = 'canplay';
export const EVENT_LOADED_METADATA = 'loadedmetadata';
export const EVENT_PLAY = 'play';
export const EVENT_PAUSE = 'pause';
export const EVENT_ENDED = 'ended';
export const EVENT_TIME_UPDATE = 'timeupdate';

// 使用到的video原生事件汇总
export const VIDEO_EVENTS: string[] = [
    EVENT_CANPLAY, 
    EVENT_ENDED, 
    EVENT_LOADED_METADATA, 
    EVENT_PAUSE, 
    EVENT_PLAY, 
    EVENT_TIME_UPDATE,
];



// 自定义事件
export const EVENT_BASE_PROGRESS_BAR_MOUSE_DOWN = 'base_progress_bar:mouse_down';
export const EVENT_BASE_PROGRESS_BAR_MOUSE_MOVE = 'base_progress_bar:mouse_move';
export const EVENT_BASE_PROGRESS_BAR_MOUSE_UP = 'base_progress_bar:mouse_up';
export const EVENT_BASE_PROGRESS_BAR_MOUSE_ENTER = 'base_progress_bar:mouse_enter';
export const EVENT_BASE_PROGRESS_BAR_MOUSE_LEAVE = 'base_progress_bar:mouse_leave';