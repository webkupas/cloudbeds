<template>
  <div class="save-btn">
    <button @click="sendData">Save</button>
  </div>
</template>

<script>
export default {
  methods: {
    /**
     * Send uptaded data
     */
    sendData () {
      this.$store.dispatch('sendData')
    }
  }
}
</script>

<style lang="scss">
  .save-btn{
    position: fixed;
    z-index: 10;
    right: 30px;
    bottom: -100px;
    transition: bottom .5s;
    &.active{
      bottom: 90px;
    }
    >button{
      color: #fff;
      border: none !important;
      outline: none !important;
      border-radius: 5px;
      font-size: 20px;
      text-align: center;
      padding: 15px 30px;
      background: #39b739;
      cursor: pointer;
      transition: background .3s;
      box-shadow: 0 0 10px #444;
      &:hover{
        background: lighten(#39b739, 10%);

      }
    }
  }
</style>
