(function() {
    let host = 'https://data.irozhlas.cz'
    if (window.location.hostname === 'localhost') {
      host = 'http://localhost'
    }
  
    fetch(host + '/mobilita-covid/mobilita-ciz.json')
      .then((response) => response.json())
      .then((data) => {
          const dat = data.map(v => [Date.parse(v[0]), v[1]]).sort((a, b) => b[0] - a[0])  
          Highcharts.chart('mobilita-ciz', {
              title: {
                  text: 'Cizinci v Česku'
              },
              subtitle: {
                  text: 'změna v počtu cizích SIM karet oproti minulosti, data: T-Mobile mobility report'
              },
              credits: {
                  enabled: false,
              },
              yAxis: {
                  title: {
                      text: 'změna v %'
                  }
              },
              xAxis: {
                  type: 'datetime',
                  endOnTick: true,
                  showLastLabel: true,
                  startOnTick: true,
                  labels:{
                      formatter: function(){
                          return Highcharts.dateFormat('%d. %m.', this.value);
                      }
                  }
              },
              tooltip: {
                  formatter: function () {
                      return this.points.reduce(function (s, point) {
                          return s + `<br/><span style="color: ${point.series.color};">${point.series.name}: ${Math.round(point.y * 10) / 10} %`
                      }, '<b>' +  Highcharts.dateFormat('%d. %m.', this.x) + '</b>');
                  },
                  shared: true,
                  useHTML: true,
              },
              legend: {
                  enabled: false,
                  layout: 'vertical',
                  align: 'right',
                  verticalAlign: 'middle'
              },
              plotOptions: {
                  series: {
                      label: {
                          connectorAllowed: false
                      },
                  }
              },
              series: [{
                  name: 'změna v počtu cizinců',
                  color: '#de2d26',
                  data: dat
              }],
          })
      
      
      })
  })()