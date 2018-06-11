<template>
  <div class="grid" @scroll.passive="onScroll($event); rullerXScroll($event)">
    <div class="grid-container" :style="{width: containerWidth, height: containerHeight}">
      <div class="ruller-x" :style="{width: containerWidth}" ref="rullerX">
        <div class="ruller-x-cell" v-for="(item, index) in rullerX" :key="'x-'+index" :style="{left: (item - 1) * 200 + 'px'}">
          {{ item }}
        </div>
      </div>
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
  </div>
</template>

<script>
import Cell from '@/components/GridCell'
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
    ...mapGetters(['renderedItems', 'rullerX']),
    containerWidth () {
      return this.sizeX * 200 + 'px'
    },
    containerHeight () {
      return this.sizeY * 100 + 'px'
    }
  },
  components: {
    'clb-cell': Cell
  },
  methods: {
    rullerXScroll (e) {
      this.$refs.rullerX.style.left = -e.target.scrollLeft + 29 + 'px'
    },
    onScroll: debounce((e) => {
      let vm = (this === undefined) ? e.target.__vue__ : this

      let top = Math.floor(e.target.scrollTop / 100) + 1
      let left = Math.floor(e.target.scrollLeft / 200) + 1
      let cols = Math.floor(window.innerWidth / 200) + 1
      let rows = Math.floor(window.innerHeight / 100) + 1
      console.log('top:', top, 'left:', left)
      console.log('rows:', rows, 'cols:', cols, 'total:', rows * cols)

      let initSet = []
      let rowMax = (rows + top <= vm.sizeY) ? rows + top : vm.sizeY
      let colMax = (rows + left <= vm.sizeX) ? rows + left : vm.sizeX
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

  .ruller-x{
    height: 30px;
    background: #eee;
    position: fixed;
    top: 0;
    left: 29px;
    z-index: 5;
    display: flex;
    border-left: 1px solid #bbb;

    &-cell{
      width: 200px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      font: 300 14px/1.2 Arial, sans-serif;
      color: #444;
      border-right: 1px solid #bbb;
      border-bottom: 1px solid #bbb;
      position: absolute;
      top: 0;
      z-index: 1;
    }
  }
</style>
