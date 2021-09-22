<!-- 高能进度条 -->
<template>
    <div class="vp-energy-progress-bar-wrap">        
        <svg class="vp-energy-progress-bar" :viewBox='`0 0 ${VIEW_BOX_WIDTH} 100`' preserveAspectRatio="none" width='100%' height='100%' >
            <defs>
                <clipPath id="curve-path"><path :d='pathD'></path></clipPath>
            </defs>

            <g clip-path='url(#curve-path)' hover-bind="1">
                <rect x='0' y='0' width='100%' height='100%' fill='rgba(255, 255, 255, .2)'></rect>
                <rect x="0" y="0" :width="curX" height="100%" fill="rgb(0, 161, 214, .5)"></rect>
                <line y1="0" y2="100%" style="stroke: rgba(255, 255, 255, .2); stroke-width: 1" :x1="curX" :x2="curX"></line>
            </g>
        </svg>
    </div>
</template>


<script lang='ts'>
import { Vue, Component, Mixins, Watch } from "vue-property-decorator";
import UsePlayer from '@/mixins/use-player';
import { isEmptyValue, isFunction, isNumber } from "@/utils";
import { secondToTime, toNumberWithKeep } from "@/utils/format";


@Component
export default class EnergyProgressBar extends Mixins(UsePlayer) {

    VIEW_BOX_WIDTH: number = 1000; // viewBox宽度 非px
    
    pathD: string = ''; // 绘制贝塞尔曲线的字符串数组
    curX: number = 0; // 当前播放时间对应高能进度条的x位置


    // 指标数据 根据配置(时间是否需要偏移)来生成格式化数据
    get series() {
        const offsetTime = this.Player.config.energyProgressBar.offsetTime;
        if(isNumber(offsetTime)) this.Player.config.energyProgressBar.series.map(item => item[this.timeKey] += offsetTime);
        return this.Player.config.energyProgressBar.series;
    }
    // 指标数据的time名称
    get timeKey() { return this.Player.config.energyProgressBar.props.timeKey || 'time'; }
    // 指标数据的value名称
    get valueKey() { return this.Player.config.energyProgressBar.props.valueKey || 'value'; }


    // 指标数据有更新则重新绘制
    @Watch('series', {immediate: true, deep: true})
    onWatchSeries(newVal: any[]) {
        this.refresh();
    }

    // 视频总时长有更新(表示更换了src)则重新绘制
    @Watch('duration', {immediate: true})
    onWatchDuration(newVal: number) {
        this.refresh();
    }

    // 当前播放时长有更新则更新当前绘制的进度
    // 用watch currentTime而不是监听timeupdate是因为滑动进度条时不会触发timeupdate但是因为设置了reactiveVideoData.currentTime所以会触发wacth同步更新curX
    @Watch('currentTime', {immediate: true})
    onWatchCurrentTime(newVal: number) {
        this.updateCurX();
    }


    // 刷新绘制
    private refresh() {
        this.reset();
        this.initPath();
    }
    
    // 重置
    private reset() {
        this.pathD = '';
        this.curX = 0;
    }
    
    // 初始化路径 
    // 主要是根据数据计算出最高值 然后通过占比来得出每一秒的坐标(x,y) 最后使用四点确定贝塞尔曲线的每一段并连接起来
    private initPath() {
        if(isEmptyValue(this.series) || isEmptyValue(this.duration)) return;

        const MAX_Y = this.series.reduce((prev, next) => Math.max(prev, next[this.valueKey]), 0);
        let [startX, endX, midX, startY, endY] = [0, 0, 0, 0, 0];
        const draws = ['M0,100', 'L0,80'];

        this.series.map(item => {
            startX = endX;
            endX = toNumberWithKeep(item[this.timeKey] / this.duration * this.VIEW_BOX_WIDTH);
            endX = endX < this.VIEW_BOX_WIDTH ? endX : this.VIEW_BOX_WIDTH;
            midX = toNumberWithKeep((startX + endX) / 2);

            startY = endY;
            endY = toNumberWithKeep(90 * (1 - item[this.valueKey] / MAX_Y)); // 90: 给顶部预留一些空间
            draws.push(`C${midX},${startY} ${midX},${endY} ${endX},${endY}`);
        })

        draws.push(`L${this.VIEW_BOX_WIDTH},100`);
        draws.push('Z');
        this.pathD = draws.join(' ');
    }


    // 更新当前绘制进度
    private updateCurX() {
        if(isEmptyValue(this.series) || isEmptyValue(this.duration)) return this.curX = 0;
        this.curX = toNumberWithKeep(this.currentTime / this.duration * this.VIEW_BOX_WIDTH) || 0;
    }



    // export 根据time获取value的方法
    getSeriesValueByTime(time: number, defaultValue: any = '-') {
        return this.series.find(item => item[this.timeKey] === time)?.[this.valueKey] || defaultValue;
    }

}
</script>


<style lang='scss' scoped>
.vp-energy-progress-bar-wrap {
    width: 100%;
    height: 24px;
}
</style>