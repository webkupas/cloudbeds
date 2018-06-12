<template>
  <div class="ruller-y" :style="{height: height}" ref="rullerY">
    <div class="ruller-y-cell" v-for="(item, index) in rullerY" :key="'y-'+index" :style="{top: (item - 1) * cellHeight + 'px'}">
      <span>{{ item }}</span>
    </div>
  </div>
</template>

<script>
import appConfig from '@/app-config'
import {mapGetters} from 'vuex'
export default {
  props: {
    height: {
      type: String
    }
  },
  data () {
    return {
      cellHeight: appConfig.cellHeight
    }
  },
  computed: {
    ...mapGetters(['rullerY'])
  }
}
</script>

<style lang="scss">
  .ruller-y{
    width: 30px;
    background: #eee;
    position: fixed;
    left: 0;
    top: 30px;
    z-index: 5;
    display: flex;
    flex-direction: column;

    &-cell{
      height: 100px;
      width: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      color: #444;
      border-right: 1px solid #bbb;
      border-bottom: 1px solid #bbb;
      position: absolute;
      left: 0;
      z-index: 1;
      >span{
        writing-mode: tb-rl;
        transform: rotate(180deg)
      }
    }
  }
</style>
