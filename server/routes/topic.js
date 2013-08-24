var util = require('util');
var db = require('../db');

// sorted set "user:%name:topics" with topic id, sort by latest_update_stamp
// hash table "topics:%tid"
// {
//  id: 1,
//  content: "Hey, slow it down whataya want from me, whataya want from me, there are might be a time",
//  create_by: emrys,
//  created_at: 1377138907,
//  reply_count: 0,
//  latest_update_stamp: 1377138907
// }
//
//  schema: "/topics", method: get
exports.getTopics = function(req, res) {
    db.zrange('user:' + req.user.username + ':topics', 0, -1, function(err, topicIds){
        if (err) {
            return res.json(404, {msg: err});
        }

        var topics = [];
        var completed_count = 0;
        if (topicIds.length === 0) {
            return res.json(topics);
        }
        topicIds.forEach(function(tid, index){
            db.hgetall('topic:' + tid, function(err, topic) {
                if (err) {
                    console.log(err);
                } else {
                    topics.push(topic);
                }
                completed_count++;
                if (completed_count === topicIds.length) {
                    return res.json(topics);
                }
            });
        });
    });
};

// schema: "/topic/:tid", method: get
exports.getTopic = function(req, res){
    db.hgetall('topic:' + req.params.tid, function(err, topic){
        if (err) {
            return res.json(404, {msg: err});
        }
        return res.json(topic);
    });
};

// schema: '/topics', method: post
//
// hash table "topics:%tid"
// {
//  id: 1,
//  content: "Hey, slow it down whataya want from me, whataya want from me, there are might be a time",
//  create_by: emrys,
//  created_at: 1377138907,
//  avatar: http://api.upyun.com/v1/emrys.jpg
//  reply_count: 0,
//  latest_update_stamp: 1377138907
// }
exports.postTopic = function(req, res){
    req.checkBody('content', 'Invalid content').notEmpty().len(0, 1000);

    var errors = req.validationErrors();
    if (errors) {
        return res.json(400, util.inspect(errors));
    }
    
    var now = (new Date()).getTime();
    db.incrby('global:nextTopicId', 1, function(err, tid){
        if (err) {
            return res.json(400, {msg: err});
        }

        db.zadd('user:' + req.user.username + ':topics', now, tid);
        var topic = {
            id: tid,
            content: req.param('content'),
            created_at: now,
            create_by: req.user.username,
            avatar: req.user.avatar
        };

        db.hmset('topic:' + tid, topic, function(err, ret){
            if (err) {
                return res.json(400, {msg: err});
            }
            return res.json({msg: ret});
        });
    });
};



// sorted set "topic:%tid:replies" with reply id, sorted by created_at, 
// hash table "reply:%rid"
// {
//  id: 1,
//  content: "It's amazing",
//  created_at: 13771389100,
//  create_by: michael,
//  avatar: http://api.upyun.com/v1/emrys.jpg
// }
//
// schema: "/topic/:tid/replies" methods: get
exports.getReplies = function(req, res) {
    var topicId = req.params.tid;
    console.log(topicId);
    db.zrange('topic:' + topicId + ":replies", 0, -1, function(err, replyIds){
        if (err) {
            return res.json(404, {msg: err});
        }

        var replies = [];
        var completed_count = 0;
        if (replyIds.length === 0) {
            return res.json(replies);
        }
        replyIds.forEach(function(rid, index){
            db.hgetall('reply:' + rid, function(err, reply){
                if (err) {
                    console.log(err);
                } else {
                    replies.push(reply);
                }
                completed_count++;
                if (completed_count === replyIds.length) {
                    return res.json(replies);
                }
            });
        });
    });
};

// schema: '/topic/:tid/reply/:rid' method: get
exports.getReply = function(req, res) {
    var replyId = req.params.rid;
    db.hgetall('reply:' + replyId, function(err, reply){
        if (err) {
            return res.json(400, {msg: err});
        } 
        return res.json(reply);
    });
};


// hash table "reply:%rid"
// {
//  id: 1,
//  content: "It's amazing",
//  created_at: 13771389100,
//  create_by: michael,
//  avatar: http://api.upyun.com/v1/emrys.jpg
// }
// schema:'/topic/:tid/replies', method: post 
exports.postReply = function(req, res) {
    req.checkBody('content', 'Invalid reply content').notEmpty().len(0, 1000);

    var errors = req.validationErrors();
    if (errors) {
        return res.json(400, util.inspect(errors));
    }

    var now = (new Date()).getTime();
    db.incrby('global:nextReplyId', 1, function(err, rid){
        if (err) {
            return res.json(400, {msg: err});
        }

        db.zadd('topic:' + req.params.tid + ':replies', now, rid, function(err, ret){
            if (err) {
                return res.json(400, {msg: err});
            }
            var reply = {
                id: rid,
                content: req.param('content'),
                created_at: now,
                create_by: req.user.username,
                avatar: req.user.avatar
            };

            db.hmset('reply:' + rid, reply, function(err, response){
                if (err) {
                    return res.json(400, {msg: err});
                }
                return res.json({msg: response});
            });
        });
    });
};
