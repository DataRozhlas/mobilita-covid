(function() {
  let host = 'https://data.irozhlas.cz'
  if (window.location.hostname === 'localhost') {
    host = 'http://localhost'
  }

  fetch(host + '/mobilita-covid/mobilita-obce.json')
    .then((response) => response.json())
    .then((data) => {
      const sel = document.createElement('select')
      sel.setAttribute('id', 'klik_sel')
      const mesta = [...new Set(data.map(v => v[1]))]
      mesta.forEach(m => sel.innerHTML += `<option value="${m}">${m}</option>`)
      document.getElementById('mobilita-klik').appendChild(sel)

      const chrt = document.createElement('div')
      chrt.setAttribute('id', 'klik_chart')
      document.getElementById('mobilita-klik').appendChild(chrt)

      function drawChart(mesto) {
        const dat = data.filter(v => v[1] === mesto).map(v => [Date.parse(v[0]), v[2]])

        Highcharts.chart('klik_chart', {
            title: {
                text: mesto
            },
            subtitle: {
                text: 'změna v počtu unikátních SIM karet oproti minulosti, data: T-Mobile mobility report'
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
                name: 'mobilita',
                data: dat
            }],
        })
    }
    document.getElementById('klik_sel').onchange = function() {
        const ev = document.getElementById('klik_sel')
        drawChart(ev.options[ev.selectedIndex].text)
    }
    
    drawChart('Brno')
    })
})()