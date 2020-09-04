var CHART1; // Score chart
var CHART2; // Accuracy chart
var CHART3; // True Score chart
var MAX_STATE = true;
var SCALE = 'linear';

var DROP1 = "Score";
var DROP2 = "Accuracy";
var DROP3 = "True Score";

var DATA_TABLE;

var FIRST_X_PER_DAY = 1;
var LAST_X_PER_DAY = 1;
var TOP_X_PER_DAY = 1;
var BOTTOM_X_PER_DAY = 1;
var TOP_X_ACC_PER_DAY = 1;
var BOTTOM_X_ACC_PER_DAY = 1;
var TOP_X_HYPER_PER_DAY = 1;
var BOTTOM_X_HYPER_PER_DAY = 1;


function update_filter_values() {
    var temp_first = parseInt(document.getElementById('first-of-day').value) / 100;
    var temp_last = parseInt(document.getElementById('last-of-day').value) / 100;
    var temp_top = parseInt(document.getElementById('top-of-day').value) / 100;
    var temp_bottom = parseInt(document.getElementById('bottom-of-day').value) / 100;
    var temp_acc_top = parseInt(document.getElementById('top-acc-of-day').value) / 100;
    var temp_acc_bottom = parseInt(document.getElementById('bottom-acc-of-day').value) / 100;
    var temp_hyper_top = parseInt(document.getElementById('top-hyper-of-day').value) / 100;
    var temp_hyper_bottom = parseInt(document.getElementById('bottom-hyper-of-day').value) / 100;

    var refilter = (temp_first != FIRST_X_PER_DAY) || (temp_last != LAST_X_PER_DAY) || (temp_top != TOP_X_PER_DAY) || (temp_bottom != BOTTOM_X_PER_DAY) ||
                   (temp_acc_top != TOP_X_ACC_PER_DAY) || (temp_acc_bottom != BOTTOM_X_ACC_PER_DAY) || (temp_hyper_top != TOP_X_HYPER_PER_DAY) || (temp_hyper_bottom != BOTTOM_X_HYPER_PER_DAY);

    if(refilter) {
        FIRST_X_PER_DAY = temp_first;
        LAST_X_PER_DAY = temp_last;
        TOP_X_PER_DAY = temp_top;
        BOTTOM_X_PER_DAY = temp_bottom;
        TOP_X_ACC_PER_DAY = temp_acc_top;
        BOTTOM_X_ACC_PER_DAY = temp_acc_bottom;
        TOP_X_HYPER_PER_DAY = temp_hyper_top;
        BOTTOM_X_HYPER_PER_DAY = temp_hyper_bottom;

        reload_data();
    }
}

function filter(samples) {
    // Input: list of scenario dicts
    var k;
    var ret = [];
    for(var i in samples)
        ret.push(samples[i]); // clone the list

    var _last_entry_of_day = [];
    var curr_day = ret[0].Time.Year * 10000 + ret[0].Time.Month * 100 + ret[0].Time.Day;
    for(i in ret) {
        var temp = ret[i].Time.Year * 10000 + ret[i].Time.Month * 100 + ret[i].Time.Day;
        if(temp != curr_day)
            _last_entry_of_day.push(i-1);

        curr_day = temp;
    }
    _last_entry_of_day.push(i);

    // Get the complex filters down to a point where they can be accomplished in one pass
    // This simplifies removing objects from the return list greatly
    i = 0;
    var days = [];
    for(var j in _last_entry_of_day) {
        days.push([]);
        for(k = i; k <= _last_entry_of_day[j]; k++) {
            days[j].push({
                        Score: ret[k].GeneralData.Score,
                        Acc: ret[k].GeneralData.Accuracy,
                        Hyperscore: ret[k].GeneralData.Hyperscore,
                        Entry: k
                      });
        }

        i = _last_entry_of_day[j] + 1;
    }

    var toremove = [];
    // Sort the days by score and add the removeable indeces
    for(j in days) {
        days[j].sort((a, b) => (a.Score > b.Score) ? 1 : -1);
        // Remove if the score is not in the top X%
        for(k = 0; k < Math.floor(days[j].length * (1-TOP_X_PER_DAY)); k++) {
            if(toremove.indexOf(days[j][k].Entry) == -1) toremove.push(days[j][k].Entry);
        }

        // Remove if the score is not in the bottom X%
        for(k = Math.ceil(days[j].length * BOTTOM_X_PER_DAY); k < days[j].length; k++) {
            if(toremove.indexOf(days[j][k].Entry) == -1) toremove.push(days[j][k].Entry);
        }

        days[j].sort((a, b) => (a.Acc > b.Acc) ? 1 : -1);
        // Remove if the acc is not in the top X%
        for(k = 0; k < Math.floor(days[j].length * (1-TOP_X_ACC_PER_DAY)); k++) {
            if(toremove.indexOf(days[j][k].Entry) == -1) toremove.push(days[j][k].Entry);
        }

        // Remove if the acc is not in the bottom X%
        for(k = Math.ceil(days[j].length * BOTTOM_X_ACC_PER_DAY); k < days[j].length; k++) {
            if(toremove.indexOf(days[j][k].Entry) == -1) toremove.push(days[j][k].Entry);
        }

        days[j].sort((a, b) => (a.Hyperscore > b.Hyperscore) ? 1 : -1);
        // Remove if the hyperscore is not in the top X%
        for(k = 0; k < Math.floor(days[j].length * (1-TOP_X_HYPER_PER_DAY)); k++) {
            if(toremove.indexOf(days[j][k].Entry) == -1) toremove.push(days[j][k].Entry);
        }

        // Remove if the hyperscore is not in the bottom X%
        for(k = Math.ceil(days[j].length * BOTTOM_X_HYPER_PER_DAY); k < days[j].length; k++) {
            if(toremove.indexOf(days[j][k].Entry) == -1) toremove.push(days[j][k].Entry);
        }
    }

    // Now everything is down to one pass so we can do it all together
    i = 0;
    for(j in _last_entry_of_day) {
        var _ending = _last_entry_of_day[j];
        // i is currently the starting spot for that day, ending is the end
        // first remove based on FIRST_X_PER_DAY
        for(k = i; k <= Math.floor((_ending - i) * (1-FIRST_X_PER_DAY) + i - 0.00001); k++) {
            if(toremove.indexOf(k) == -1) toremove.push(k);
        }

        // second remove based on LAST_X_PER_DAY
        for(k = Math.floor((_ending - i) * LAST_X_PER_DAY + i) + 1; k <= _ending; k++) {
            if(toremove.indexOf(k) == -1) toremove.push(k);
        }

        i = _ending + 1;
    }

    // Sort in reverse, so we don't run into issues as we remove items
    toremove.sort((a, b) => (a < b) ? 1 : -1);
    for(i in toremove) {
        ret.splice(toremove[i], 1);
    }
    console.log("Removing " + toremove.length + " items.")
    return ret;
}

function update_charts() {
    var d1 = document.getElementById('chart1-select');
    var d2 = document.getElementById('chart2-select');
    var d3 = document.getElementById('chart3-select');
    var drops = [ d1, d2, d3 ];

    var selected;
    var old;
    var changed;
    if(d1.value != DROP1) {
        old = DROP1;
        DROP1 = d1.value;
        selected = DROP1;
        changed = 0;
        redraw(CHART1, selected);
    } else if(d2.value != DROP2) {
        old = DROP2;
        DROP2 = d2.value;
        selected = DROP2;
        changed = 1;
        redraw(CHART2, selected);
    } else {
        old = DROP3;
        DROP3 = d3.value;
        selected = DROP3;
        changed = 2;
        redraw(CHART3, selected);
    }

    for(var j = 0; j < drops[changed].length; j++) {
        if(drops[changed][j].value == selected) {
            drops[changed][j].hidden = true;
        } else if(drops[changed][j].value == old) {
            drops[changed][j].hidden = false;
        }
    }
    // var d1 = document.getElementById('chart1-select');
    // var d2 = document.getElementById('chart2-select');
    // var d3 = document.getElementById('chart3-select');
    // var drops = [ d1, d2, d3 ];
    //
    // var selected;
    // var old;
    // if(d1.value != DROP1) {
    //     old = DROP1;
    //     DROP1 = d1.value;
    //     selected = DROP1;
    //     redraw(CHART1, selected);
    // } else if(d2.value != DROP2) {
    //     old = DROP2;
    //     DROP2 = d2.value;
    //     selected = DROP2;
    //     redraw(CHART2, selected);
    // } else {
    //     old = DROP3;
    //     DROP3 = d3.value;
    //     selected = DROP3;
    //     redraw(CHART3, selected);
    // }
    //
    // for(var i = 0; i < drops.length; i++) {
    //     for(var j = 0; j < d1.length; j++) {
    //         if(drops[i][j].value == selected) {
    //             drops[i][j].hidden = true;
    //         } else if(drops[i][j].value == old) {
    //             drops[i][j].hidden = false;
    //         }
    //     }
    // }
}

function redraw(chart, selected) {
    // No need to update labels b/c that will already have the correct amount of entries
    chart.data.datasets[0].data =[];
    chart.data.datasets[0].label = selected;
     var list = filter(JSON.parse(window.localStorage.getItem('challenge_data'))[document.getElementById('dropdown').value]);
     for(var i in list) {
         chart.data.datasets[0].data.push(list[i].GeneralData[selected]);
     }
    chart.update();
}

// function toggle_scaling() {
//     SCALE = (SCALE == 'linear') ? 'logarithmic' : 'linear';
//     CHART1.options.scales.yAxes[0].type = SCALE;
//     CHART2.options.scales.yAxes[0].type = SCALE;
//     CHART3.options.scales.yAxes[0].type = SCALE;
//     document.getElementById('toggle-scale').innerText = 'Score Axis Scale: ' + SCALE;
//     CHART1.update();
//     CHART2.update();
//     CHART3.update();
// }
//
// function toggle_max_state() {
//     MAX_STATE = !MAX_STATE;
//     CHART1.options.scales.yAxes[0].ticks.beginAtZero = MAX_STATE;
//     CHART2.options.scales.yAxes[0].ticks.beginAtZero = MAX_STATE;
//     CHART3.options.scales.yAxes[0].ticks.beginAtZero = MAX_STATE;
//     document.getElementById('toggle-max').innerText = 'Scale From Zero: ' + ((MAX_STATE) ? 'On' : 'Off');
//     CHART1.update();
//     CHART2.update();
//     CHART3.update();
// }

function post_file_collection() {
    document.getElementById('pre-folder-items').remove();
    document.getElementById('post-folder-items').style.visibility = 'visible';
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

    reload_data();
}

function reload_data() {
    // Reset chart data
    CHART1.data.labels = [];
    CHART1.data.datasets[0].data = [];
    CHART2.data.labels = [];
    CHART2.data.datasets[0].data = [];
    CHART3.data.labels = [];
    CHART3.data.datasets[0].data = [];
    DATA_TABLE.clearData();

    // Scenario is stored in id='dropdown'
    var dropdown = document.getElementById('dropdown');
    var scenario = dropdown[dropdown.selectedIndex].text;
    var challenge_data = JSON.parse(window.localStorage.getItem('challenge_data'));
    var list = filter(challenge_data[scenario]);

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
        CHART1.data.labels.push(list[j].Time.DateStamp);  // we need labels for placeholders, even though we don't use them
        CHART2.data.labels.push(list[j].Time.DateStamp);
        CHART3.data.labels.push(list[j].Time.DateStamp);
        CHART1.data.datasets[0].data.push(data[DROP1]);
        CHART2.data.datasets[0].data.push(data[DROP2]);
        CHART3.data.datasets[0].data.push(data[DROP3]);

        // Update the data table
        DATA_TABLE.addData({
            Date: list[j].Time.DateStamp,
            Score: list[j].GeneralData.Score,
            Accuracy: list[j].GeneralData.Accuracy,
            'True Score': list[j].GeneralData['True Score'],
            'Hyperscore': list[j].GeneralData.Hyperscore,
        });

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
            max_unadjusted = data['True Score'];
            _max_unadjusted = j;
        }
        if(data.Score / data.Accuracy < min_unadjusted) {
            min_unadjusted = data['True Score'];
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

    CHART1.update();
    CHART2.update();
    CHART3.update();
}

function create_chart() {
    var opts = ['Hyperscore', 'Kills', 'Deaths', 'Avg TTK', 'Fight Time', 'Damage Taken'];
    for(var i in opts) {
        for(var j = 1; j <= 3; j++) {
            if(document.getElementById('chart' + j + '-select').value == opts[j])
                continue;

            var opt = document.createElement('option');
            opt.value = opts[i];
            opt.text = opts[i];

            document.getElementById('chart' + j + '-select').appendChild(opt);
        }
    }

    // Create Tabulator data table
    DATA_TABLE = new Tabulator("#data-table", {
        // Couldn't get rowClick to only display the gridline for a single x, so I'm not using it
        // rowClick:function(e, row) {
        //     X_GRIDLINE_INDEX = row.getPosition();
        //     CHART1.update();
        //     CHART2.update();
        //     CHART3.update();
        // },

        autoColumns: true,
        responsiveLayout: true,
        layout:"fitDataStretch",
        addRowPos: "top",
        columns: [
            {title: 'Date', field: 'Date'},
            {title: 'Score', field: 'Score'},
            {title: 'Accuracy', field: 'Accuracy'},
            {title: 'True Score', field: 'True Score'},
            {title: 'Hyperscore', field: 'Hyperscore'}
        ]
    });

    // Create charts
    var ctx = document.getElementById('chart1').getContext('2d');
    CHART1 = new Chart(ctx, {
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
            }]
        }, options: {
            scales: {
                xAxes: [{
                    display: true,
                    gridLines: {
                        display: false
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
                        suggestedMax: 1,
                    },
                }]
            },
            legend: {
                display: false
            }
        }
    });

    ctx = document.getElementById('chart2').getContext('2d');
    CHART2 = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Accuracy',
                fill: false,
                yAxisID: 'Accuracy',
                backgroundColor: 'rgba(255, 99, 132, 0.20)',
                borderColor: 'rgba(255, 99, 132, 0.50)',
                data: []
            }]
        },
        options: {
            scales: {
                xAxes: [{
                    display: true,
                    gridLines: {
                        display: false
                    },
                    ticks: {
                        callback: function(value, index, values) {
                            return '';
                        }
                    }
                }],
                yAxes: [{
                    id: 'Accuracy',
                    type: 'linear',
                    position: 'left',
                    ticks: {
                        beginAtZero: true,
                        suggestedMax: 1,
                        /*userCallback: function(label, index, labels) {
                            console.log("label: " + label + "parseInt(label).toFixed(2): " + parseInt(label).toFixed(2))
                            return label.toFixed(2);
                        }*/
                    },
                    gridLines: {
                        display: true
                    },
                }]
            },
            legend: {
                display: false
            }
        }
    });

    ctx = document.getElementById('chart3').getContext('2d');
    CHART3 = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'True Score',
                fill: false,
                //yAxisID: 'Score',
                backgroundColor: 'rgba(255, 99, 132, 0.20)',
                borderColor: 'rgba(255, 99, 132, 0.50)',
                data: []
            }]
        },
        options: {
            scales: {
                xAxes: [{
                    display: true,
                    gridLines: {
                        display: false
                    },
                    ticks: {
                        callback: function(value, index, values) {
                            return '';
                        },
                    }
                }],
                yAxes: [{
                    id: 'Score',
                    type: 'linear',
                    position: 'left',
                    ticks: {
                        beginAtZero: true,
                        suggestedMax: 1,
                    },
                }]
            },
            legend: {
                display: false
            }
        }
    });
}
