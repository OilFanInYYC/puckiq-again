var rq = require('request');

function AjaxHelper(app, request, config) {

    var helper = this;
    var baseUrl = config.api.host;
    console.log("baseUrl", baseUrl);

    this.getAjaxRequest = function(req, res) {
        var query = req.query;
        var pqreq = req.params.pqreq;
        var serialize = serializeQuery(req.query);
        res.render('__' + pqreq + '/index');
    };

    this.getPlayerRangeWowy = function(req, res) {

        var query = req.query;
        var serialize = serializeQuery(query);
        //var url = baseUrl + '/m2/schedule/getRangeWowy?' + serialize;
        var url = baseUrl + '/wowy/player?' + serialize;

        rq.get({ url: url, json: true }, (err, response, data) => {
            var datacheck = (!err && response.statusCode !== 200) ? false : true;
            var wowy = (!err && response.statusCode !== 200) ? [] : data;
            console.log("getting stats from", url);

            helper._renderPlayerResults(req, res, {
                view: '__player-wowy-range/index',
                player_id: query.q2player1id,
                query: query,
                check: datacheck,
                data: wowy
            });

        });
    };

    this.getPlayerSeasonWowy = function(req, res) {

        var query = req.query;
        var serialize = serializeQuery(query);
        var url = baseUrl + '/m2/seasonwowy/getSeasonWowy?' + serialize;
        // var url = baseUrl + '/stats/wowy?' + serialize;

        rq.get({ url: url, json: true }, (err, response, data) => {

            var datacheck = (!err && response.statusCode !== 200) ? false : true;
            var wowy = (!err && response.statusCode !== 200) ? [] : data;

            helper._renderPlayerResults(req, res, {
                view : '__player-wowy-season/index',
                player_id : query.q2player1id,
                query: query,
                check: datacheck,
                data: wowy
            });
        });
    };

    this.getPlayerRangeWoodmoney = function(req, res) {

        var query = req.query;
        var serialize = serializeQuery(query);
        var url = baseUrl + '/m2/schedule/getRangeWoodMoney?' + serialize;
        // var url = baseUrl + '/stats/woodmoney?' + serialize;

        rq.get({ url: url, json: true }, (err, response, data) => {
            var datacheck = (!err && response.statusCode !== 200) ? false : true;
            var woodmoney = (!err && response.statusCode !== 200) ? [] : data;

            helper._renderPlayerResults(req, res, {
                view : '__player-woodmoney-range/index',
                player_id : query.q2player1id,
                query: query,
                check: datacheck,
                data: woodmoney
            });
        });
    };

    this.getPlayerSeasonWoodmoney = function(req, res) {

        var query = req.query;
        var serialize = serializeQuery(query);
        var url = baseUrl + '/m2/seasonwoodmoney/getSeasonWoodMoney?' + serialize;
        //var url = baseUrl + '/stats/woodmoney?' + serialize;

        rq.get({url: url, json: true }, (err, response, data) => {
            var datacheck = (!err && response.statusCode !== 200) ? false : true;
            var wowy = (!err && response.statusCode !== 200) ? [] : data;

            console.log(data);
            helper._renderPlayerResults(req, res, {
                view : '__player-woodmoney-season/index',
                player_id : query.q2player1id,
                query: query,
                check: datacheck,
                data: wowy
            });
        });
    };

    this._renderPlayerResults = function(req, res, options) {
        rq.get({ url: baseUrl + '/players/' + options.player_id, json: true }, (err, r, d) => {
            if(err) {
                res.render('error');
            } else {
                if(!d.length) {
                    res.render('error');
                } else {
                    res.render(options.view, {
                        check: options.check,
                        data: options.data,
                        queryData: options.query,
                        player1info: d[0]
                    });
                }
            }
        });
    };
}

function serializeQuery(query) {
    var serialized = "";
    Object.keys(query).forEach(function(key) {
        if(query[key] !== '' && typeof key !== 'undefined' && key.substr(0, 2) !== 'q3') {
            if(isArray(query[key])) {
                query[key].forEach(function(val) {
                    serialized += key.toString() + '[]=' + val.toString() + '&';
                });
            } else {
                serialized += key.toString() + '=' + query[key].toString() + '&';
            }
        }
    });
    return serialized.substr(0, serialized.length - 1);
}

function isArray(n) {
    return Array.isArray(n);
}

module.exports = AjaxHelper;