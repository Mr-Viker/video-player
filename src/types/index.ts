import Vue from "vue";


// VideoPlayer实例类型
export interface IPlayer extends Vue {
    config: IPlayerConfig,
    reactiveVideoData: IReactiveVideoData,
    video: HTMLVideoElement,
    toggle(): IPlayer,
    play(): IPlayer,
    pause(): IPlayer,
    seek(time: number): IPlayer,
    [key: string]: any,
}


// 播放器配置
export interface IPlayerConfig {
    mutex?: boolean, // 互斥 true表示只能播放一个视频 false表示能同时播放多个视频(可以多个实例一起播放)
    video?: IVideo,
    controlBar?: IControlBar,
    baseProgressBar?: IBaseProgressBar,
    energyProgressBar?: IEnergyProgressBar,
    progressBar?: IProgressBar,
    actionBar?: IActionBar,
    playButton?: IPlayButton,
    timer?: ITimer,
    volume?: IVolume,
    settingButton?: ISettingButton,
    fullScreenButton?: IFullScreenButton,
    [key: string]: any,
}

// 视频配置 video的所有属性都可以通过prop传进组件
interface IVideo {
    autoplay?: boolean,
    loop?: boolean,
    muted?: boolean,
    preload?: 'auto' | 'none' | 'meta',
    volume?: number,
    src?: string,
    poster?: string,
    [key: string]: any,
}

// 控制栏配置
interface IControlBar {
    show?: boolean, // 是否展示控制栏
    [key: string]: any,
}

// 基础进度条配置(进度条+高能进度条容器)
interface IBaseProgressBar {
    show?: boolean,
    // 鼠标悬浮时展示的tooltips
    tooltips?: {
        show?: boolean,
        format?: (data: ITooltipsFormatData, config: IPlayerConfig) => string, // 格式化显示
    },
    [key: string]: any,
}

// 格式化显示tooltips的数据
interface ITooltipsFormatData {
    videoTime: number, // 当前鼠标对应的时间
    originSeriesTime: number, // 当前鼠标对应的时间减去offsetTime后的时间 对应的是playerConfig传入的时间 如果不设置offsetTime则和videoTimey相等
    formatTime: string, // 格式化成HH:mm:ss的时间
    value: number | string, // 高能值
}

// 高能进度条配置
interface IEnergyProgressBar {
    show?: boolean,
    series?: any[], // 数据
    props?: {
        timeKey?: string, // 数据的time对应的key
        valueKey?: string, // 数据的value对应的key
        timeText?: string, // 数据的time对应的显示文本
        valueText?: string, // 数据的value对应的显示文本
    },
    offsetTime?: number, // 指定time的偏移量 如果接口返回的数据从第1s开始，默认情况下是右区间[1s,2s)；如果需要改成左区间[0s,1s)，则需要设置offsetTime: -1
    [key: string]: any,
}

// 进度条配置
interface IProgressBar {
    show?: boolean,
    // 高亮标记
    marks?: {
        show?: true,
        props?: {
            labelKey?: string, // 数据的label名称
            valueKey?: string, // 数据的value名称
            labelText?: string, // 数据的label对应的显示文本
            valueText?: string, // 数据的value对应的显示文本
            labelType?: 'time' | 'percent', // label的类型 具体时间 | 比例(包括百分比和小数 会自动计算)
        },
        data?: Record<string, any>[], // 数据
        format?: (item: Record<string, any>, config: IPlayerConfig) => string, // 格式化显示
    }
    [key: string]: any,
}

// 操作栏配置
interface IActionBar {
    show?: boolean,
    [key: string]: any,
}

// 播放按钮配置
interface IPlayButton {
    show?: boolean,
    [key: string]: any,
}

// 播放时间配置
interface ITimer {
    show?: boolean,
    [key: string]: any,
}

// 音量配置
interface IVolume {
    show?: boolean,
    [key: string]: any,
}

// 设置按钮配置
interface ISettingButton {
    show?: boolean,
    list?: {
        loop?: ISettingItem,
        epb?: ISettingItem,
    },
    [key: string]: any,
}
// 设置项配置
interface ISettingItem {
    show?: boolean, // 是否显示
    label?: string, // 设置项名称
    disabled?: boolean, // 是否禁用
}

// 全屏按钮配置
interface IFullScreenButton {
    show?: boolean,
    [key: string]: any,
}


// 响应式的视频数据
export interface IReactiveVideoData {
    paused?: boolean, // 是否暂停状态
    duration?: number, // 总时长
    currentTime?: number, // 当前播放时长
    fullScreen?: boolean, // 是否全屏状态
    [key: string]: any,
}