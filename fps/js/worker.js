onmessage = function(e) {
    // Probably should implement something that looks down the directory tree,
    // or just force the user to find the stats folder themselves (Probably
    // not a horrible decision)
    var requisite_path_entires = [ "steamapps", "common", "FPSAimTrainer", "FPSAimTrainer", "stats" ];
    var unique_challenges = [];
    var challenge_data = {};
    var tosend = {};

    for(var i in e.data) {
        var file = e.data[i];
        var path;
        var split;

        // If the lastModified field == 0 then the file is a sample file; don't bother checking its path
        if(file.lastModified != 0) {
            try {
                if(file.path.includes('\\'))
                    path = file.path.split('\\');
                else
                    path = file.path.split('/');
            } catch(error) {
                path = file.webkitRelativePath.split('/');
                requisite_path_entires = [ "stats" ];
            }

            for(var j in requisite_path_entires) {
                if(path[path.length - j - 2] != requisite_path_entires[requisite_path_entires.length-j-1]) {
                    tosend.Error = "badpath";
                    tosend.ErrorMessage = "Incorrect path chosen.  Trying selecting a path that looks like \".../steamapps/common/FPSAimTrainer/FPSAimTrainer/stats/\"";
                    postMessage(tosend);
                    return;
                }
            }

            split = file.webkitRelativePath.split('/');
        } else {
            split = [ 'stats/', file.name ];
        }
        var fr = new FileReaderSync();
        var stats_dict = process_stats(fr.readAsText(file));


        split = split[split.length - 1].split(' - Challenge - ');
        if(!unique_challenges.includes(split[0])) {
            challenge_data[split[0]] = [];
            unique_challenges.push(split[0]);
        }

        var date = split[1].split(' Stats.csv')[0];
        var full_list = [];
        full_list = full_list.concat(date.split('-')[0].split('.'));
        full_list = full_list.concat(date.split('-')[1].split('.'));

        for(j in full_list) {
            full_list[j] = parseInt(full_list[j]);
        }
        date = new Date(full_list[0], full_list[1]-1, full_list[2],
                        full_list[3], full_list[4], full_list[5]);
        stats_dict.Time = {};
        stats_dict.Time.Epoch = date.getTime();
        stats_dict.Time.DateStamp = date.toLocaleString();
        stats_dict.Time.Year = date.getFullYear();
        stats_dict.Time.Month = date.getMonth();
        stats_dict.Time.Day = date.getDay();
        stats_dict.Time.Hours = date.getHours();
        stats_dict.Time.Minutes = date.getMinutes();
        stats_dict.Time.Seconds = date.getSeconds();

        challenge_data[split[0]].push(stats_dict);
    }

    for(var item in challenge_data) {
        challenge_data[item].sort((a, b) => (a.Time.Epoch > b.Time.Epoch) ? 1 : -1);
    }
    tosend.unique_challenges = unique_challenges;
    tosend.challenge_data = challenge_data;
    postMessage(tosend);
};

function process_stats(filetext) {
    // TODO: Consider removing the stats like each individual kill that just take up
    //       space and, as of now, aren't used

    // Returns JSON as done in previous Python implementation
    var lines = filetext.split('\n');
    var _line = 0;
    var split;
    var i;

    var dict = {};
    dict.KillData = {};
    var kill_data_header = lines[_line].split(',');
    for(i in kill_data_header) {
        kill_data_header[i] = conv(kill_data_header[i]);
        dict.KillData[kill_data_header[i]] = [];
    }

    _line++;
    while(lines[_line] != '\r' && lines[_line] != '' && lines[_line] != '\n') {
        split = lines[_line].split(',');
        for(i = 0; i < split.length; i++) {
            dict.KillData[kill_data_header[i]].push(conv(split[i]));
        }

        _line++;
    }

    _line++;
    var weapon_data_header = lines[_line].split(',');
    dict.WeaponData = [];
    _line++;
    split = lines[_line].split(',');
    while(split[0] != '\r' && split[0] != '' && split[0] != '\n') {
        var to_add = {};
        for(i = 0; i < split.length-1; i++) {
            to_add[conv(weapon_data_header[i])] = conv(split[i]);
        }
        dict.WeaponData.push(to_add);
        _line++;
        split = lines[_line].split(',');
    }

    dict.GeneralData = {};
    _line++;
    split = lines[_line].split(',');
    while(split[0] != '\r' && split[0] != '' && split[0] != '\n') {
        dict.GeneralData[conv(split[0]).slice(0, split[0].length)] = conv(split[1]);
        _line++;
        split = lines[_line].split(',');
    }

    // Compute overall Accuracy
    var shots = 0;
    var hits = 0;
    for(i in dict.WeaponData) {
        shots += dict.WeaponData[i].Shots;
        hits += dict.WeaponData[i].Hits;
    }
    dict.GeneralData.Accuracy = (hits/shots).toFixed(2);
    dict.GeneralData['True Score'] = (dict.GeneralData.Score / dict.GeneralData.Accuracy).toFixed(2);
    dict.GeneralData.Hyperscore = (dict.GeneralData.Score * Math.pow(dict.GeneralData.Accuracy, 2)).toFixed(2);

    dict.Settings = {};
    _line++;
    split = lines[_line].split(',');
    while(split[0] != '\r' && split[0] != '' && split[0] != '\n') {
        dict.Settings[conv(split[0]).slice(0, split[0].length)] = conv(split[1]);
        _line++;
        split = lines[_line].split(',');
    }

    return dict;
}

function conv(x) {
    // Yes parsing float twice is super innefficient but I don't know how to get down to 2 decimal places without
    // using .toFixed and I hate floating point errors
    x = x.replace('\r', '').replace('\n', '').replace(':', '');
    var val = parseFloat(x);
    if(isNaN(val)) {
        return x;
    }

    return parseFloat(val.toFixed(2));
}

function add_dropdown_option(option) {
    var opt = document.createElement("option");
    opt.value = option;
    opt.text = option;
    opt.appendChild(opt);
}
