<template>
  <div class="ruller-x" :style="{width: width}" >
    <div class="ruller-x-cell" v-for="(item, index) in rullerX" :key="'x-'+index" :style="{left: (item - 1) * cellWidth + 'px'}">
      {{ item }}
    </div>
  </div>
</template>

<script>
import appConfig from '@/app-config'
import {mapGetters} from 'vuex'
export default {
  props: {
    width: {
      type: String
    }
  },
  data () {
    return {
      cellWidth: appConfig.cellWidth
    }
  },
  computed: {
    ...mapGetters(['rullerX'])
  }
}
</script>

<style lang="scss">
  .ruller-x{
    height: 30px;
    background: #eee;
    position: fixed;
    top: 0;
    left: 30px;
    z-index: 5;
    display: flex;

    &-cell{
      width: 200px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      color: #444;
      border-right: 1px solid #bbb;
      border-bottom: 1px solid #bbb;
      position: absolute;
      top: 0;
      z-index: 1;
    }
  }
</style>
