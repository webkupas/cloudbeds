<template>
  <div class="grid" @scroll.passive="onScroll($event); rullersScroll($event)">
    <div class="grid-container" :style="{width: containerWidth, height: containerHeight}">
      <div class="ruller-start"></div>
      <!-- Ruller X -->
      <div class="ruller-x" :style="{width: containerWidth}" ref="rullerX">
        <div class="ruller-x-cell" v-for="(item, index) in rullerX" :key="'x-'+index" :style="{left: (item - 1) * 200 + 'px'}">
          {{ item }}
        </div>
      </div>
      <!-- / Ruller X -->

      <!-- Ruller Y -->
      <div class="ruller-y" :style="{height: containerHeight}" ref="rullerY">
        <div class="ruller-y-cell" v-for="(item, index) in rullerY" :key="'y-'+index" :style="{top: (item - 1) * 100 + 'px'}">
          <span>{{ item }}</span>
        </div>
      </div>
      <!-- / Ruller Y -->

       <clb-cell
          v-for="(item, key, index) in renderedItems"
          :key="index"
          :row="+key.split('x')[1]"
          :col="+key.split('x')[0]"
          :text.sync="item.text"
          :state="item.state"
          :disabled.sync="item.disabled"
        />
    </div>

    <clb-save-btn :class="{active: Object.keys(dataToSave).length > 0}"/>
  </div>
</template>

<script>
import Cell from '@/components/GridCell'
import SaveBtn from '@/components/SaveButton'
import {mapGetters} from 'vuex'
import store from '@/store'
import debounce from 'lodash/debounce'
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
      posX: 3,
      posY: 1
    }
  },
  computed: {
    ...mapGetters(['renderedItems', 'rullerX', 'rullerY', 'dataToSave']),
    containerWidth () {
      return this.sizeX * 200 + 'px'
    },
    containerHeight () {
      return this.sizeY * 100 + 'px'
    }
  },
  components: {
    'clb-cell': Cell,
    'clb-save-btn': SaveBtn
  },
  methods: {
    rullersScroll (e) {
      this.$refs.rullerX.style.left = -e.target.scrollLeft + 30 + 'px'
      this.$refs.rullerY.style.top = -e.target.scrollTop + 30 + 'px'
    },
    onScroll: debounce((e) => {
      let vm = (this === undefined) ? e.target.__vue__ : this

      let top = Math.floor(e.target.scrollTop / 100) + 1
      let left = Math.floor(e.target.scrollLeft / 200) + 1
      let cols = Math.floor(window.innerWidth / 200) + 1
      let rows = Math.floor(window.innerHeight / 100) + 1

      let initSet = []
      let rowMax = (rows + top <= vm.sizeY) ? rows + top : vm.sizeY
      let colMax = (cols + left <= vm.sizeX) ? cols + left : vm.sizeX
      for (let i = top; i <= rowMax; i++) {
        for (let j = left; j <= colMax; j++) {
          initSet.push({x: j, y: i})
        }
      }

      store.dispatch('addItems', initSet)
    }, 100)
  },
  created () {
    /* Initial loading */
    let cols = Math.floor(window.innerWidth / 200) + 1
    let rows = Math.floor(window.innerHeight / 100) + 1
    let initSet = []

    for (let i = 1; i <= rows; i++) {
      for (let j = 1; j <= cols; j++) {
        initSet.push({x: j, y: i})
      }
    }

    this.$store.dispatch('addItems', initSet)
  }
}
</script>

<style lang="scss">
  .grid{
    height: calc(100% - 30px);
    width: calc(100% - 30px);
    position: relative;
    overflow: auto;
    margin: 30px 0 0 30px;

    &-container{
      flex: 1 0 auto;
      flex-direction: column;
      overflow: hidden;
    }
  }

  .ruller-start{
    position: fixed;
    width: 30px;
    height: 30px;
    left: 0;
    top: 0;
    z-index: 10;
    background: #fff;
    border-bottom: 1px solid #bbb;
    border-right: 1px solid #bbb;
  }

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
