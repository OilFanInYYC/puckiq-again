"use strict";

const _ = require("lodash");
const constants = require("./constants");

const definition = {
    "name": "Name",
    "season": "Season",
    "team": "Team",
    "positions": "Positions",
    "games_played": "Games Played",
    "shift_type": "Shift Type",
    "shifts": "Shifts",
    "toi": "TOI (min)",
    "toi_per_game": "TOI/Game (min)",
    "shift_pct": "Shift Start %",
    "gf": "GF",
    "ga": "GA",
    "gf60": "GF60",
    "ga60": "GA60",
    "gfpct": "GF%",
    "cf": "CF",
    "ca": "CA",
    "cf60": "CF60",
    "ca60": "CA60",
    "cfpct": "CF%",
    "dff": "DFF",
    "dfa": "DFA",
    "dff60": "DFF60",
    "dfa60": "DFA60",
    "dffpct": "DFF%",
    "avgshift": "AVG Shift (s)"
};

exports.build = (data, group_by) => {

    let is_date_range = !!(data.request.from_date && data.request.to_date);

    let _definition = _.extend({}, definition);
    if(is_date_range) delete _definition.season;
    if(group_by === constants.group_by.player_season){
        delete _definition.team;
    } else if(group_by === constants.group_by.player){
        delete _definition.team;
        delete _definition.season;
    }

    let headers = _.values(_definition);

    let records = _.chain(data.results)
        .map(x => {
            let row = { };

            _.each(_.keys(_definition), field => {
                if (_.has(x._id, field)) {
                    row[field] = x._id[field];
                } else {
                    if (!_.has(x, field)) {
                        console.log("Missing field", field);
                    } else {
                        row[field] = x[field];
                    }
                }
            });
            return _.values(row);
        }).value();

    records.unshift(headers);

    return records;
};
