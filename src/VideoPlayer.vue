<template>
    <div :class="['video-player vp', {'video-player--paused': reactiveVideoData.paused}, {'video--player--not-hover': !mouseData.hover}]"
        @mouseenter="onVPMouseEnter" @mouseleave="onVPMouseLeave"
        >
        <div class="vp-video-wrap" @click.stop="toggle">
            <video v-bind="{...config.video, ...$attrs}" class="vp-video" ref="video"></video>
        </div>
        <ControlBar v-if="config.controlBar.show" />
    </div>
</template>


<script lang='ts'>
import { Vue, Component, Provide, Prop, Watch } from "vue-property-decorator";

import ControlBar from './components/ControlBar.vue';

import { defaultPlayerConfig, PlayerInstances } from './utils/player-config';
import { deepAssign, deepClone } from "./utils";
import { EVENT_ENDED, EVENT_LOADED_METADATA, EVENT_PAUSE, EVENT_PLAY, EVENT_TIME_UPDATE, VIDEO_EVENTS } from "./utils/events";
import { toNumberWithKeep } from "./utils/format";
import { IPlayer, IPlayerConfig, IReactiveVideoData } from "./types";


@Component({
    name: 'VideoPlayer',
    components: { ControlBar },
})
export default class VideoPlayer extends Vue {
    @Provide() Player: IPlayer = this;
    
    @Prop(Object) playerConfig!: IPlayerConfig; // 配置对象


    config: IPlayerConfig = deepClone(defaultPlayerConfig); // 合并后的配置对象
    // 需要响应式的视频数据 主要是将video的原生数据(非响应式)转换成响应式的数据
    reactiveVideoData: IReactiveVideoData = {
        paused: true, // 是否在暂停状态
        duration: 0, // 时长
        currentTime: 0, // 当前播放时长
        fullScreen: false, // 是否处于全屏状态 video原生没有该字段
    };
    // 鼠标数据
    mouseData = { 
        hover: true, // 当前鼠标是否悬浮在videoPlayer上 
        timer: null, // 隐藏计时器
    };
    

    get video() { return this.$refs.video as HTMLVideoElement; } // 原生视频引用


    // 监听传入的配置 如果有变动则合并到config
    @Watch('playerConfig', {immediate: true, deep: true})
    onWatchConfig(newVal: IPlayerConfig) {
        if(newVal) deepAssign(this.config, newVal);
    }


    /*********************** 初始化 start *********************************/

    // 初始化事件类并将当前实例推入实例数组
    created() {
        this.initEvents();
        PlayerInstances.push(this);
    }

    // 将video原生事件代理到Player
    mounted() {
        this.proxyVideoEvents();
    }

    // 初始化事件监听器
    private initEvents() {
        // 元数据加载完成(更换src也会导致触发) 因此在这里要全量同步video信息到reactiveVideoData
        this.$on(EVENT_LOADED_METADATA, this.initVideoPlayer);
        // 播放开始 同步播放状态并检测更新互斥
        this.$on(EVENT_PLAY, () => { this.syncVideoToRVD('paused'); this.checkUpdateMutex(); });
        // 播放暂停 同步播放状态
        this.$on(EVENT_PAUSE, () => this.syncVideoToRVD('paused'));
        // 播放结束 同步播放状态
        this.$on(EVENT_ENDED, () => this.syncVideoToRVD('paused'));
        // 播放位置改变 更新当前播放时长
        this.$on(EVENT_TIME_UPDATE, () => this.syncVideoToRVD('currentTime'));
    }

    // 将video原生事件代理到Player
    private proxyVideoEvents() {
        VIDEO_EVENTS.map(event => this.video.addEventListener(event, data => this.$emit(event, data)));
    }


    // 初始化相关数据
    // 元数据加载完成(更换src也会导致触发) 因此在这里要全量同步video信息到reactiveVideoData 并重置鼠标数据
    initVideoPlayer() {
        this.syncVideoToRVD();
        this.onVPMouseEnter();
    }
    

    /*********************** 初始化 start *********************************/


    /*********************** 播放相关 start *********************************/

    // 切换播放/暂停
    toggle() {
        return this.reactiveVideoData.paused ? this.play() : this.pause();
    }

    // 代理video播放方法
    play() {
        this.checkUpdateMutex();
        this.video.play();
        return this;
    }

    // 代理video暂停方法
    pause() {
        this.video.pause();
        return this;
    }

    // 跳跃到指定时间(不会自动播放)
    seek(time: number) {
        time = time < 0 ? 0 : time > this.reactiveVideoData.duration ? this.reactiveVideoData.duration : time;
        this.Player.reactiveVideoData.currentTime = this.Player.video.currentTime = toNumberWithKeep(time);
        return this;
    }

    // 同步video状态到响应式数据
    private syncVideoToRVD(key?: string) {
        if(key) return this.reactiveVideoData[key] = this.video[key];
        return Object.keys(this.reactiveVideoData).forEach(key => this.reactiveVideoData[key] = this.video[key]);
    }

    // 检测并更新互斥
    private checkUpdateMutex() {
        if(this.config.mutex) {
            PlayerInstances.map(pi => {
                if(pi !== this && !pi.reactiveVideoData.paused) pi.pause();
            })
        }
    }
    

    /*********************** 播放相关 end *********************************/



    /*********************** 鼠标事件 start *********************************/

    // 鼠标移入 显示完整的控制栏
    onVPMouseEnter() {
        this.destroyMouseTimer();
        this.mouseData.hover = true;
    }

    // 鼠标移除 如果在播放状态则隐藏控制栏(只显示进度条)
    onVPMouseLeave() {
        if(this.reactiveVideoData.paused) return;
        this.mouseData.timer = setTimeout(() => this.mouseData.hover = false, 500);
    }

    // 清空隐藏鼠标定时器
    private destroyMouseTimer() {
        this.mouseData.timer && clearTimeout(this.mouseData.timer);
        this.mouseData.timer = null;
    }

    /*********************** 鼠标事件 end *********************************/


    // 销毁
    beforeDestroy() {
        this.destroyMouseTimer();
        this.pause();
        PlayerInstances.splice(PlayerInstances.indexOf(this), 1);
    }
}
</script>


<style lang='scss' scoped>
.video-player {
    position: relative;
    background-color: #000;
    overflow: hidden;

    &.video--player--not-hover {
        .vp-control-bar {
            bottom: -37px; // actionbar height + half progressbar height
            opacity: .6;
        }
    }

    .vp-video-wrap {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        
        .vp-video {
            max-width: 100%;
            max-height: 100%;
        }
    }

}
</style>