/**
 * 配置
 */

import { IPlayerConfig } from "../types";


export const PlayerInstances = []; // 本实例数组 主要用于互斥

// 默认配置 用户设置会覆盖当前默认设置的值
export const defaultPlayerConfig: IPlayerConfig = {
    mutex: true,
    video: {
        autoplay: true,
        loop: false,
        preload: 'auto',
    },
    controlBar: { show: true },
    baseProgressBar: { 
        show: true, 
        tooltips: {
            show: true,
            format: ({formatTime, value}, config) => {
                const { timeText = '时间', valueText = '值' } = config.energyProgressBar.props || {};
                return config.energyProgressBar.show ? `<div>${timeText}: ${formatTime}</div><div>${valueText}: ${value}</div>` : formatTime;
            },
        }
    },
    energyProgressBar: { 
        show: false,
        series: [],
        height: 24,
    },
    progressBar: { 
        show: true,
    },
    actionBar: { show: true },
    playButton: { show: true },
    timer: { show: true },
    volume: { show: true },
    settingButton: { 
        show: true,
        list: {
            loop: { show: true, label: '循环播放' },
            epb: { show: false, label: '高能进度条' },
        }
    },
    fullScreenButton: { show: true },
}