<template>
  <div class="cell" :data-row="row" :data-col="col" :style="styles">
    <label class="cell-chkb">
      <input type="checkbox">
    </label>
    <div class="cell-text">
      <input type="text" :value="text">
    </div>
  </div>
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      default: true
    },
    state: {
      type: String,
      default: 'ready'
    },
    text: {
      type: String,
      default: ''
    },
    row: {
      type: Number
    },
    col: {
      type: Number
    }
  },
  computed: {
    styles () {
      return {
        left: (this.col - 1) * 200 + 'px',
        top: (this.row - 1) * 100 + 'px'
      }
    }
  },
  created () {
    // console.log(this.text)
  }
}
</script>

<style lang="scss">
  .cell{
    position: absolute;
    top: 0;
    bottom: 0;
    width: 200px;
    height: 100px;
    //border-left: 1px solid #bbb;
    border-top: none;
    border-right: none;
    background: #fff;
    display: flex;
    outline: 1px solid #bbb;
    &:first-child{
      border-left: none;
    }
    &:hover{
      background: #eee;
    }

    &-chkb{
      flex: 1 0 30px;
      display: flex;
      align-items: center;
      border-right: 1px solid #ddd;
      justify-content: center;
      position: relative;
      cursor: pointer;
      overflow: hidden;
      &:before{
        content: '';
        display: block;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        position: absolute;

      }
      >input[type="checkbox"]{

      }

    }

    &-text{
      flex: 1 1 auto;
      display: flex;
      flex-direction: column;
      padding: 10px;
      align-items: center;
      justify-content: center;

      >input[type="text"]{
        width: 100%;
        display: block;
        max-width: 100%;
      }
    }
  }
</style>
