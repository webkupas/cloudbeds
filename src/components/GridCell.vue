<template>
  <div class="cell" :class="state" :data-row="row" :data-col="col" :style="styles">
    <label class="cell-chkb">
      <input type="checkbox" :value="disabled" @change="$emit('update:disabled', !disabled); addDataToSave($event)">
      <i></i>
    </label>
    <div class="cell-text">
      <input type="text"
        :value="text"
        :disabled="disabled"
        @input="$emit('update:text', $event.target.value)"
        @change="addDataToSave"
        @keypress="typeOnlyDigits">
    </div>

    <div class="cell-preloader">
      <div class="ripple"><div></div><div></div></div>
    </div>

  </div>
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
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
    },
    width: 100
  },
  methods: {
    typeOnlyDigits (e) {
      if (e.which !== 8 && e.which !== 0 && (e.which < 48 || e.which > 57)) e.preventDefault()
    },
    addDataToSave (e) {
      this.$store.dispatch('addDataToSave', {
        x: this.col,
        y: this.row,
        text: this.text,
        disabled: (e.target.type === 'text') ? this.disabled : !this.disabled
      })
    }
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

      >input[type="checkbox"]{
        position: absolute;
        left: 0;
        top: 0;
        z-index: -1;
        left: -100px;
        top: -100px;

        &:checked{
          ~i:after{
            opacity: 1;
          }
        }
      }

      >i{
        display: block;
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;

        &:before{
          content: '';
          display: block;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
          margin: auto;
          position: absolute;
          width: 20px;
          height: 20px;
          border: 2px solid #aaa;
          border-radius: 2px;
        }

        &:after{
          content: '\2714';
          color: #aaa;
          display: block;
          left: 0;
          top: 0;
          right: 6px;
          bottom: 6px;
          margin: auto;
          position: absolute;
          width: 10px;
          height: 10px;
          opacity: 0;
          transition: opacity .3s;
          font-size: 14px;
        }
      }
    }

    &-text{
      flex: 1 1 170px;
      display: flex;
      flex-direction: column;
      padding: 10px;
      align-items: center;
      justify-content: center;

      >input[type="text"]{
        width: 100%;
        display: block;
        max-width: 100%;
        padding: 10px 5px;
        border: 2px solid #aaa;
        border-radius: 2px;
      }
    }
  }

  .cell-preloader{
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    background: #fff;
    transition: all 1s;

    .cell.active &{
      opacity: 0;
      transform: scale(.4);
      z-index: -1;
    }

    .cell.loading &{
      opacity: 1;
      transform: scale(1)
    }
  }

  .ripple {
    display: inline-block;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    width: 64px;
    height: 64px;
  }
  .ripple div {
    position: absolute;
    border: 2px solid #bbb;
    opacity: 1;
    border-radius: 50%;
    animation: ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
  }
  .ripple div:nth-child(2) {
    animation-delay: -0.5s;
  }
  @keyframes ripple {
    0% {
      top: 28px;
      left: 28px;
      width: 0;
      height: 0;
      opacity: 1;
    }
    100% {
      top: -1px;
      left: -1px;
      width: 58px;
      height: 58px;
      opacity: 0;
    }
  }
</style>
