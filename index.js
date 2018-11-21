

var getTemperatureData = new Promise (
  (resolve, reject) => {
    var req = new XMLHttpRequest();
    req.onreadystatechange = () => {
      if (req.readyState === XMLHttpRequest.DONE) {
        if (req.status === 200) {
          var res = JSON.parse(req.responseText);
          resolve(res);
        }
      }
    };
    req.open('GET', '/readings');
    req.send();
  }
)


getTemperatureData.then((values) => {
  var graphData = [];
  values.forEach((value) => {
    graphData.push({x: value.timestamp, y: value.reading});
  });

  var timeseriesPlot = Vue.component('timeseries-plot', {
    extends: VueChartJs.Line,
    props: ['chartData', 'options'],
    mounted () {
      this.renderChart({
        datasets: [{
          label: 'Temperature',
          data: graphData
        }]
      }, {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
              xAxes: [{
                  type: 'time',
                  distribution: 'series'
              }],
              yAxes: [{
                  min: 10,
                  max: 30
              }]
          },
      })
    }
  });

  var app = new Vue({
    el: '#temperature-plot',
    components: {
      timeseriesPlot
    }
  });
});
