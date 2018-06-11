<template>
  <div id="app">
    <clb-grid
      :sizeX="sizeX"
      :sizeY="sizeY"
    />
  </div>
</template>

<script>
import Grid from '@/components/Grid'
export default {
  name: 'app',
  data () {
    return {
      sizeX: 40000,
      sizeY: 40000
    }
  },
  components: {
    'clb-grid': Grid
  }
}
</script>

<style lang="scss">
*,
*:before,
*:after{
  box-sizing: border-box;
}
body{
  overflow: hidden;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100vh;
}
</style>
