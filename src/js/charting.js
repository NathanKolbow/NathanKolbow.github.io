function draw_chart() {
    var ctx = document.getElementById('myChart').getContext('2d');
    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
            labels: ['2020-03-04 10:03:45', '2020-05-09 13:13:13', '2020-06-01 14:13:12', '2020-06-02 14:32:23', '2020-07-01 12:11:10', '2020-07-11 19:23:23', '2020-07-13 21:32:00'],
            datasets: [{
                label: 'My First dataset',
                yAxisID: 'A',
                backgroundColor: 'rgba(255, 99, 132, 0.50)',
                borderColor: 'rgba(255, 99, 132, 0.50)',
                data: [0, 10, 5, 2, 20, 30, 45]
            },
            {
                label: 'My Second dataset',
                yAxisID: 'B',
                backgroundColor: 'rgba(99, 132, 255, 0.50)',
                borderColor: 'rgba(99, 132, 255, 0.50)',
                data: [10, 5, 10, 3, 15, 40, 27]
            }]
        },

        // Configuration options go here
        options: {
            scales: {
                xAxes: [{
                    display: true,
                    gridLines: {
                        borderDash: [8, 4],
                        color: "#ff0000"
                    },
                    ticks: {
                        callback: function(value, index, values) {
                            return '';
                        }
                    }
                }],
                yAxes: [{
                    id: 'A',
                    type: 'linear',
                    position: 'left',
                    //gridLines: {
                    //    borderDash: [8, 4],
                    //    color: "#348632"
                    //}
                }, {
                    id: 'B',
                    type: 'linear',
                    position: 'right'
                }]
            },
            legend: {
                display: false
            }
        }
    });
}
