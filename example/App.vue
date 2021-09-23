<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/> -->

    <!-- src='https://api.dogecloud.com/player/get.mp4?vcode=5ac682e6f8231991&userId=17&ext=.mp4'  -->
    <VideoPlayer
      style="width: 700px; height: 400px"
      :playerConfig="playerConfig"
      @play="onPlay"
      @timeupdate="onTimeupdate"
    />

    <hr />

    <!-- <VideoPlayer
      style="width: 700px; height: 400px"
      :playerConfig="playerConfig"
      @play="onPlay"
      @timeupdate="onTimeupdate"
      src='https://api.dogecloud.com/player/get.mp4?vcode=5ac682e6f8231991&userId=17&ext=.mp4' 
    /> -->

    <button @click="onClick">点击更换src</button>
  </div>
</template>

<script lang="ts">
import { IPlayerConfig } from "@/types";
import { Component, Vue } from "vue-property-decorator";
import HelloWorld from "./components/HelloWorld.vue";


@Component({
  components: {
    HelloWorld,
  },
})
export default class App extends Vue {
  srcs: string[] = [
    "https://www.runoob.com/try/demo_source/movie.mp4",
    "https://api.dogecloud.com/player/get.mp4?vcode=5ac682e6f8231991&userId=17&ext=.mp4",
    "https://www.w3school.com.cn/i/movie.ogg",
  ];
  index: number = 0;

  playerConfig: IPlayerConfig = {
    video: {
      src: this.srcs[0],
      poster: "//www.runoob.com/wp-content/themes/runoob/assets/img/404.jpg",
      autoplay: false,
    },
    // actionBar: {show: false},
    // baseProgressBar: {
    //   tooltips: {
    //     // format: ({formatTime, value}, config) => {
    //     //   return config.energyProgressBar.show ? `<div>时间: ${formatTime}</div><div>值: ${value}</div>` : formatTime;
    //     // }
    //   }
    // },
    energyProgressBar: {
      show: true,
      props: {
        timeKey: "second",
        valueKey: "extValue",
        timeText: '进度',
        valueText: '高能值',
      },
      series: [],
      // offsetTime: -1,
    },
    progressBar: { 
        show: true,
        marks: {
            show: true,
            data: [
                { progress: '25%', value: 100 },
                { progress: '50%', value: 50 },
                { progress: '75%', value: 31 },
                { progress: '99%', value: 10 },
            ],
            props: {
                labelKey: 'progress',
                valueKey: 'value',
                labelType: 'percent',
            },
            format: (item, config) => `<div>进度: ${item.progress}</div><div>值: ${item.value}</div>`
        },
    },
    settingButton: {
      list: {
        epb: {
          show: true,
          // disabled: true,
        }
      }
    }
  };

  created() {
    this.updateSeires();
  }

  onClick() {
    this.index = +!this.index;
    this.playerConfig.video.src = this.srcs[this.index];
    this.updateSeires();
    console.log("click: ", this.index, this.playerConfig.video.src);
  }

  onPlay(ev) {
    // console.log('onPlay: ', ev);
  }

  onTimeupdate(ev) {
    // console.log('onTimeupdate: ', ev);
  }


  updateSeires() {
    setTimeout(() => {
      this.playerConfig.energyProgressBar.series = [
        { extValue: 1000, second: 1 },
        { extValue: 500, second: 2 },
        { extValue: 300, second: 3 },
        { extValue: 600, second: 4 },
        { extValue: 200, second: 5 },
        { extValue: 1200, second: 6 },
        { extValue: 1100, second: 7 },
        { extValue: 100, second: 8 },
        { extValue: 300, second: 9 },
        { extValue: 1000, second: 10 },
        { extValue: 500, second: 11 },
        { extValue: 1000, second: 12 },
      ];
    }, 1000);
  }
  
}
</script>

<style lang="scss">
#app {
  // font-family: Avenir, Helvetica, Arial, sans-serif;
  // -webkit-font-smoothing: antialiased;
  // -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  // color: #2c3e50;
  // margin-top: 60px;
}
</style>
