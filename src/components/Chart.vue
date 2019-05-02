<style scoped>
  .chart { width:100%; max-width:600px; height:300px; margin:0 auto; }
</style>

<template>
  <div class="chart" ref="chartdiv"></div>
</template>

<script>
  import * as am4core from "@amcharts/amcharts4/core"
  import * as am4charts from "@amcharts/amcharts4/charts"
  import am4themes_dark from "@amcharts/amcharts4/themes/dark"
  am4core.useTheme(am4themes_dark)

  function addTotalRewardsToChart(chart) {
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis())
    valueAxis.title.text        = "Rewards per Day"
    valueAxis.tooltip.disabled  = true
    valueAxis.fillOpacity       = 0.5
    valueAxis.fontSize          = 13
    valueAxis.min               = 0
    valueAxis.max               = 11000000
    valueAxis.strictMinMax      = true
    valueAxis.renderer.grid.template.disabled = true

    let series = chart.series.push(new am4charts.ColumnSeries())
    series.dataFields.valueY    = "total_rewards"
    series.dataFields.dateX     = "date"
    series.yAxis                = valueAxis
    series.name                 = "Rewards per Day"
    series.fill                 = chart.colors.getIndex(13)
    series.strokeWidth          = 0
    series.fillOpacity          = 0.6
    series.tooltipText          = "{valueY.value}"
  }

  function addAverageDifficultyToChart(chart) {
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis())
    valueAxis.title.text        = "Average Difficulty"
    valueAxis.renderer.opposite = true
    valueAxis.tooltip.disabled  = true
    valueAxis.fillOpacity       = 0.5
    valueAxis.fontSize          = 13
    valueAxis.renderer.grid.template.disabled = true

    let series = chart.series.push(new am4charts.LineSeries())
    series.dataFields.valueY    = "avg_difficulty"
    series.dataFields.dateX     = "date"
    series.yAxis                = valueAxis
    series.name                 = "Average Difficulty"
    series.stroke               = chart.colors.getIndex(11)
    series.strokeWidth          = 2
    series.tooltipText          = "{valueY.value}"
  }

  function initChart(chart) {
    chart.paddingRight    = 15
    chart.cursor          = new am4charts.XYCursor()
    chart.legend          = new am4charts.Legend()
    chart.legend.position = "top"
    chart.legend.fontSize = 14
    chart.fillOpacity     = 0.7

    let dateAxis = chart.xAxes.push(new am4charts.DateAxis())
    dateAxis.fillOpacity  = 0.5
    dateAxis.fontSize     = 13
    dateAxis.renderer.grid.template.disabled = true

    return chart
  }

  export default {
    name: 'Chart',
    sockets: {
      connect() {
        setTimeout(function(){
          this.$socket.emit('request', 'fullDailyInfo')
        }.bind(this), 500)
      },
      fullDailyInfo(daily_info) {
        this.chart.data.length = 0
        for (var date in daily_info) {
          var day_info = daily_info[date]
          var obj = {'date':date, 'avg_difficulty':Math.round(day_info.total_difficulty/day_info.blocks), 'total_rewards':day_info.total_rewards}
          this.chart.data.push(obj)
        }
        this.chart.validateData()
      },
      newDailyInfo(daily_info) {
        var date = Object.keys(daily_info)[0]
        var day_info = daily_info[date]
        var obj = {'date':date, 'avg_difficulty':Math.round(day_info.total_difficulty/day_info.blocks), 'total_rewards':day_info.total_rewards}
        if (this.chart.data[this.chart.data.length-1].date == date) {
          this.chart.data[this.chart.data.length-1] = obj
        } else {
          this.chart.data.push(obj)
        }
        this.chart.validateData()
      }
    },
    mounted() {
      let chart = am4core.create(this.$refs.chartdiv, am4charts.XYChart)
      this.chart = initChart(chart)
      addTotalRewardsToChart(this.chart)
      addAverageDifficultyToChart(this.chart)
    },
    beforeDestroy() {
      if (this.chart) {
        this.chart.dispose()
      }
    }
  }
</script>
