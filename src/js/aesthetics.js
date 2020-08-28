var chart;

function post_file_collection() {
    document.getElementById('select-text').remove();
    document.getElementById('file-picker').remove();
    document.getElementById('dropdown').style.visibility = 'visible';
    document.getElementById('stats-paragraph').style.visibility = 'visible';
}

function update_dropdown() {
    // New dropdown options are stored in window.localStorage.getItem('unique_challenges')
    var dropdown = document.getElementById('dropdown');
    // Remove everything except the first, default option
    for(var j = dropdown.length; j > 0; j--) {
        dropdown.remove(j);
    }
    dropdown[0].text = 'Select Scenario';

    var unique_challenges = JSON.parse(window.localStorage.getItem('unique_challenges'));
    for(j in unique_challenges) {
        var opt = document.createElement('option');
        opt.value = unique_challenges[j];
        opt.text = unique_challenges[j];
        dropdown.appendChild(opt);
    }
}

function update_chart() {
    // Reset chart data
    chart.data.labels = [];
    chart.data.datasets[0].data = [];
    chart.data.datasets[1].data = [];
    chart.data.datasets[2].data = [];

    // Scenario is stored in id='dropdown'
    var dropdown = document.getElementById('dropdown');
    var scenario = dropdown[dropdown.selectedIndex].text;
    var challenge_data = JSON.parse(window.localStorage.getItem('challenge_data'));
    var list = challenge_data[scenario];

    var max_score = -1;
    var _max_score = -1;
    var min_score = Number.MAX_SAFE_INTEGER;
    var _min_score = -1;
    var max_unadjusted = -1;
    var _max_unadjusted = -1;
    var min_unadjusted = Number.MAX_SAFE_INTEGER;
    var _min_unadjusted = -1;
    var max_acc = 0;
    var _max_acc = -1;
    var min_acc = 1;
    var _min_acc = -1;

    var data;
    for(var j in list) {
        data = list[j].GeneralData;

        // Add the data to the chart
        chart.data.labels.push('');  // we need labels for placeholders, even though we don't use them
        chart.data.datasets[0].data.push(data.Score);
        chart.data.datasets[1].data.push(data.Score / data.Accuracy);
        chart.data.datasets[2].data.push(data.Accuracy);

        // Collect max and min data
        if(data.Score > max_score) {
            max_score = data.Score;
            _max_score = j;
        }
        if(data.Score < min_score) {
            min_score = data.Score;
            _min_score = j;
        }
        if(data.Score / data.Accuracy > max_acc) {
            max_unadjusted = data.Score / data.Accuracy;
            _max_unadjusted = j;
        }
        if(data.Score / data.Accuracy < min_acc) {
            min_unadjusted = data.Score / data.Accuracy;
            _min_unadjusted = j;
        }
        if(data.Accuracy > max_acc) {
            max_acc = data.Accuracy;
            _max_acc = j;
        }
        if(data.Accuracy < min_acc) {
            min_acc = data.Accuracy;
            _min_acc = j;
        }
    }

    chart.update();
}

function create_chart() {
    var ctx = document.getElementById('myChart').getContext('2d');
    chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
            labels: [],
            datasets: [{
                label: 'Score',
                fill: false,
                yAxisID: 'Score',
                backgroundColor: 'rgba(255, 99, 132, 0.20)',
                borderColor: 'rgba(255, 99, 132, 0.50)',
                data: []
            },
            {
                label: 'Unadjusted Score',
                fill: false,
                //yAxisID: 'Score',
                backgroundColor: 'rgba(132, 255, 99, 0.20)',
                borderColor: 'rgba(132, 255, 99, 0.50)',
                data: []
            },
            {
                label: 'Accuracy',
                fill: false,
                yAxisID: 'Accuracy',
                backgroundColor: 'rgba(99, 132, 255, 0.20)',
                borderColor: 'rgba(99, 132, 255, 0.50)',
                data: []
            }]
        },

        // Configuration options go here
        options: {
            scales: {
                xAxes: [{
                    display: true,
                    gridLines: {
                        display: false
                    //    borderDash: [8, 4],
                    //    color: "#ff0000"
                    },
                    ticks: {
                        callback: function(value, index, values) {
                            return '';
                        }
                    }
                }],
                yAxes: [{
                    id: 'Score',
                    type: 'linear',
                    position: 'left',
                    //gridLines: {
                    //    borderDash: [8, 4],
                    //    color: "#348632"
                    //}
                }, {
                    id: 'Accuracy',
                    type: 'linear',
                    position: 'right'
                }]
            },
            legend: {
                display: true
            }
        }
    });
}
