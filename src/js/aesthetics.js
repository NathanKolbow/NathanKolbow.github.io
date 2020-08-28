var CHART;
var MAX_STATE = false;

function post_file_collection() {
    document.getElementById('footnote').remove();
    document.getElementById('file-picker').remove();
    document.getElementById('picker-button').remove();
    document.getElementById('dropdown').style.visibility = 'visible';
}

function update_dropdown() {
    // New dropdown options are stored in window.localStorage.getItem('unique_challenges')
    var dropdown = document.getElementById('dropdown');
    // Remove everything except the first, default option
    for(var j = 0; j < dropdown.length; j++) {
        dropdown.remove(0);
    }

    var unique_challenges = JSON.parse(window.localStorage.getItem('unique_challenges'));
    for(j in unique_challenges) {
        var opt = document.createElement('option');
        opt.value = unique_challenges[j];
        opt.text = unique_challenges[j];
        dropdown.appendChild(opt);
    }

    update_chart();
}

function update_chart() {
    // Reset chart data
    CHART.data.labels = [];
    CHART.data.datasets[0].data = [];
    CHART.data.datasets[1].data = [];
    CHART.data.datasets[2].data = [];

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
        CHART.data.labels.push('');  // we need labels for placeholders, even though we don't use them
        CHART.data.datasets[0].data.push(data.Score);
        CHART.data.datasets[1].data.push((data.Score / data.Accuracy).toFixed(5));
        CHART.data.datasets[2].data.push(data.Accuracy);

        // Collect max and min data
        if(data.Score > max_score) {
            max_score = data.Score;
            _max_score = j;
        }
        if(data.Score < min_score) {
            min_score = data.Score;
            _min_score = j;
        }
        if(data.Score / data.Accuracy > max_unadjusted) {
            max_unadjusted = parseFloat((data.Score / data.Accuracy).toFixed(5));
            _max_unadjusted = j;
        }
        if(data.Score / data.Accuracy < min_unadjusted) {
            min_unadjusted = parseFloat((data.Score / data.Accuracy).toFixed(5));
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

    CHART.update();
    document.getElementById('stats-paragraph').innerText = "Max Score: " + max_score.toFixed(2) +
                                                           "\tMin Score: " + min_score.toFixed(2) +
                                                           "\nMax Unadjusted: " + max_unadjusted.toFixed(2) +
                                                           "\tMin Unadjusted: " + min_unadjusted.toFixed(2) +
                                                           "\nMax Acc: " + max_acc.toFixed(2) +
                                                           "\tMin Acc: " + min_acc.toFixed(2);
}

function create_chart() {
    var ctx = document.getElementById('myChart').getContext('2d');
    CHART = new Chart(ctx, {
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
                    ticks: {
                        beginAtZero: true,
                    },
                    scaleLabel: {
                        labelString: 'Scores',
                        display: true,
                    }
                    //gridLines: {
                    //    borderDash: [8, 4],
                    //    color: "#348632"
                    //}
                }, {
                    id: 'Accuracy',
                    type: 'linear',
                    position: 'right',
                    ticks: {
                        beginAtZero: true,
                        suggestedMax: 1,
                        stepSize: 0.25,
                        /*userCallback: function(label, index, labels) {
                            console.log("label: " + label + "parseInt(label).toFixed(2): " + parseInt(label).toFixed(2))
                            return label.toFixed(2);
                        }*/
                    },
                    gridLines: {
                        display: false
                    },
                    scaleLabel: {
                        labelString: 'Accuracy',
                        display: true,
                    }
                }]
            },
            legend: {
                display: true
            }
        }
    });
}
