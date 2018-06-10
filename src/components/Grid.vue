<template>
  <div class="grid">
    <div class="grid-left">
      <clb-slider
        v-model="posY"
        :max="sizeY"
        :min="1"
        :direction="'vertical'"
        tooltip-dir="right"
        width="8"
        reverse
        :style="{'height': '90%'}"
      >
      </clb-slider>
    </div>
    <div class="grid-right">
      <div class="ruller-x">
        <clb-slider
          v-model="posX"
          :max="sizeX"
          :min="1"
          width="90%"
        >
        </clb-slider>
      </div>
      <div class="grid-container">
        <div class="grid-cells">

        </div>
      </div>
    </div>

  </div>
</template>

<script>
import Slider from 'vue-slider-component'
export default {
  props: {
    sizeX: {
      type: Number,
      default: 100
    },
    sizeY: {
      type: Number,
      default: 100
    }
  },
  data () {
    return {
      label: '',
      active: false,
      posX: 1,
      posY: 1
    }
  },
  components: {
    'clb-slider': Slider
  }
}
</script>

<style lang="scss" scoped>
  .grid{
    display: flex;
    height: 100%;
    width: 100vw;

    &-left{
      width: 40px;
      padding-top: 5%;
    }

    &-right{
      flex: 1 0 auto;
      display: flex;
      flex-direction: column;
    }

    &-container{
      flex: 1 0 auto;
      display: flex;
      flex-direction: column;
      padding: 0 40px 40px 0;
    }

    &-cells{
      background: #ddd;
      flex: 1 0 auto;
    }
  }

  .ruller-x{
    padding: 0 0 20px 5%;
  }
</style>
