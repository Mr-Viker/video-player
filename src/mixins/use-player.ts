import { Vue, Component, Watch, Inject } from "vue-property-decorator";
import { IPlayer } from "@/types";


@Component
export default class UsePlayer extends Vue {
    @Inject() Player!: IPlayer; // VideoPlayer组件实例

    // 总时长
    get duration() { return this.Player.reactiveVideoData.duration; }
    // 当前播放时长
    get currentTime() { return this.Player.reactiveVideoData.currentTime; }

}
