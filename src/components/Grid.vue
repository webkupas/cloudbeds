<template>
  <div class="grid" @scroll.passive="onScroll">
    <div class="grid-container" :style="{width: containerWidth, height: containerHeight}">
      <template v-for="(row, rowIndex) in renderedItems" v-if="row !== undefined">
        <clb-cell
          v-if="cell !== undefined"
          v-for="(cell, colIndex) in row"
          :key="rowIndex + '-' + colIndex"
          :row="colIndex"
          :col="rowIndex"
          :text="(cell.text !== undefined) ? cell.text : ''"
        />
      </template>

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
    ...mapGetters(['renderedItems']),
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
    onScroll: debounce((e) => {
      let top = Math.floor(e.target.scrollTop / 100) + 1
      let left = Math.floor(e.target.scrollLeft / 200) + 1
      let cols = Math.floor(window.innerWidth / 200) + 1
      let rows = Math.floor(window.innerHeight / 100) + 1
      console.log('top:', top, 'left:', left)
      console.log('rows:', rows, 'cols:', cols, 'total:', rows * cols)

      let initSet = []
      for (let i = top; i <= rows + top - 1; i++) {
        for (let j = left; j <= cols + left - 1; j++) {
          initSet.push({x: j, y: i})
        }
      }

      // console.log(initSet)

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
    height: 100%;
    width: 100%;
    position: relative;
    overflow: auto;

    &-container{
      flex: 1 0 auto;
      flex-direction: column;
      overflow: hidden;
    }
  }

  .ruller-x{
    padding: 0 0 20px 5%;
  }
</style>