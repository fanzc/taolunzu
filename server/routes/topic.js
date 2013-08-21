var db = require('../db');

exports.getTopicList = function(req, res) {
    db.zrange('user:' + req.user.id + ':topics', 0, -1, function(err, replies){
        if (err) {
            res.json(404, {msg: err});
        }
        var topics = [];
        var tasks = [];
        var completed_count = 0;

        var checkIfComplete = function() {
            if (completed_count === topics.length) {
                res.json(topics);
            }
        };

        var getTopicDetailById = function(tid){
            return function() {
                db.get('topic:' + tid, function(err, response) {
                    completed_count++;
                    if (err) {
                        console.log(err);
                    } else {
                        topics.push(response);
                        checkIfComplete();
                    }
                });
            };
        };

        for(var reply in replies) {
            var task = getTopicDetailById(tid);
            tasks.push(task);
        }
        for(var t in tasks) {
            tasks[t]();
        }
    });
};

exports.getTopicDetail = function(req, res, next) {
    var topicId = req.params.tid;
    db.zrange('topic:' + topicId + ":conversations", function(err, replies){
        if (err) {
            return res.json(404, {msg: err});
        }
        res.json(replies);
    });
};
