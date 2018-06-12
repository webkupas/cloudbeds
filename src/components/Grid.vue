<template>
  <div class="grid" @scroll.passive="onScroll($event); rullersScroll($event)" ref="grid">
    <div class="grid-container" :style="{width: containerWidth, height: containerHeight}">
      <div class="ruller-start"></div>
      <clb-ruler-x :width="containerWidth" ref="rullerX"/>
      <clb-ruler-y :height="containerHeight" ref="rullerY"/>

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
import appConfig from '@/app-config'
import {mapGetters} from 'vuex'
import debounce from 'lodash/debounce'
import Cell from '@/components/GridCell'
import SaveBtn from '@/components/SaveButton'
import RullerX from '@/components/RullerX'
import RullerY from '@/components/RullerY'
export default {
  data () {
    return {
      cellWidth: appConfig.cellWidth,
      cellHeight: appConfig.cellHeight
    }
  },
  computed: {
    ...mapGetters([
      'renderedItems',
      'dataToSave']),
    /**
     * Entire grid container width
     */
    containerWidth () {
      return appConfig.sizeX * appConfig.cellWidth + 'px'
    },
    /**
     * Entire grid container height
     */
    containerHeight () {
      return appConfig.sizeY * appConfig.cellHeight + 'px'
    }
  },
  components: {
    'clb-cell': Cell,
    'clb-save-btn': SaveBtn,
    'clb-ruler-x': RullerX,
    'clb-ruler-y': RullerY
  },
  methods: {
    /**
     * Scroll event handler.
     * Scroll horizontal and vertical rullers within main grid container
     */
    rullersScroll (e) {
      this.$refs.rullerX.$el.style.left = -e.target.scrollLeft + 30 + 'px'
      this.$refs.rullerY.$el.style.top = -e.target.scrollTop + 30 + 'px'
    },
    /**
     * Scroll event handler to get all cell in viewport to manage them from store.
     * Use 100 ms delay for better performance
     */
    onScroll: debounce((e) => {
      let vm = (this === undefined) ? e.target.__vue__ : this
      let initSet = vm.getViewportAreaCells(vm, e.target)
      vm.$store.dispatch('addItems', initSet)
    }, 100),
    /**
     * Returns array of cells located in current viewport
     * @param  vm - component reference
     * @param  {DOMNode} gridDOMNode - grid container DOM node
     * @param  {Boolean} isInitialLoading=false - true for initial loading
     *
     * @returns {Array}
     */
    getViewportAreaCells (vm, gridDOMNode, isInitialLoading = false) {
      let top = isInitialLoading ? 1 : Math.floor(gridDOMNode.scrollTop / appConfig.cellHeight) + 1
      let left = isInitialLoading ? 1 : Math.floor(gridDOMNode.scrollLeft / appConfig.cellWidth) + 1
      let cols = Math.floor(window.innerWidth / appConfig.cellWidth) + 1
      let rows = Math.floor(window.innerHeight / appConfig.cellHeight) + 1

      let initSet = []
      let rowMax = (rows + top <= appConfig.sizeY) ? rows + top : appConfig.sizeY
      let colMax = (cols + left <= appConfig.sizeX) ? cols + left : appConfig.sizeX

      for (let i = top; i <= rowMax; i++) {
        for (let j = left; j <= colMax; j++) {
          initSet.push({x: j, y: i})
        }
      }

      return initSet
    }
  },
  created () {
    let initSet = this.getViewportAreaCells(this, null, true)
    this.$store.dispatch('addItems', initSet)

    /**
     * Rezize window event handler to get all cell in viewport to manage them from store
     */
    window.addEventListener('resize', () => {
      let initSet = this.getViewportAreaCells(this, this.$refs.grid)
      this.$store.dispatch('addItems', initSet)
    })
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
</style>
