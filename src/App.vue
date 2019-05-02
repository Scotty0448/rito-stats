<template>
  <div id="app">
    <StatsPanel/>
    <Chart/>
  </div>
</template>

<script>
  import StatsPanel from './components/StatsPanel.vue'
  import Chart from './components/Chart.vue'

  export default {
    name: 'app',
    components: {
      StatsPanel,
      Chart
    }
  }
</script>
