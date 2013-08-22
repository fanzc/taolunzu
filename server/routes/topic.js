var util = require('util');
var db = require('../db');

// sorted set "user:%name:topics" with topic id, sort by latest_update_stamp
// hash table "topics:%tid"
// {
//  id: 1,
//  title: "whataya want from me",
//  description: "Hey, slow it down whataya want from me, whataya want from me, there are might be a time",
//  created_by: emrys,
//  created_at: 1377138907,
//  reply_count: 0,
//  latest_update_stamp: 1377138907
// }
//
//  schema: "/topics", method: get
exports.getTopics = function(req, res) {
    db.zrange('user:' + req.user.name + ':topics', 0, -1, function(err, topicIds){
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
// title="what"&description="about"
//
// hash table "topics:%tid"
// {
//  id: 1,
//  title: "whataya want from me",
//  description: "Hey, slow it down whataya want from me, whataya want from me, there are might be a time",
//  created_by: emrys,
//  created_at: 1377138907,
//  avatar: http://api.upyun.com/v1/emrys.jpg
//  reply_count: 0,
//  latest_update_stamp: 1377138907
// }
exports.postTopic = function(req, res){
    req.checkBody('title', 'Invalid title').notEmpty().len(140);
    req.checkBody('description', 'Invalid description').notEmpty().len(1000);

    var errors = req.validationErrors();
    if (errors) {
        return res.json(400, util.inspect(errors));
    }
    
    var now = (new Date()).getTime();
    db.incrby('global:nextTopicId', 1, function(err, tid){
        if (err) {
            return res.json(400, {msg: err});
        }

        db.zadd('user:' + req.user.name + ':topics', now, tid);
        var topic = {
            id: tid,
            title: req.sanitize('title'),
            description: req.sanitize('description'),
            created_at: now,
            create_by: req.user.name,
            avatar: req.user.avatar
        };

        db.hmset('topic:' + tid, topic, function(err, res){
            if (err) {
                return res.json(400, {msg: err});
            }
            return res.json({msg: res});
        });
    });
};



// sorted set "topic:%tid:replies" with reply id, sorted by created_at, 
// hash table "reply:%rid"
// {
//  id: 1,
//  content: "It's amazing",
//  created_at: 13771389100,
//  created_by: michael,
//  avatar: http://api.upyun.com/v1/emrys.jpg
// }
//
// schema: "/topic/:tid/replies" methods: get
exports.getReplies = function(req, res) {
    var topicId = req.params.tid;
    db.zrange('topic:' + topicId + ":replies", function(err, replyIds){
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
//  created_by: michael,
//  avatar: http://api.upyun.com/v1/emrys.jpg
// }
// schema:'/topic/:tid/replies', method: post 
exports.postReply = function(req, res) {
    req.checkBody('content', 'Invalid reply content').notEmpty().len(1000);

    var errors = req.validationErrors();
    if (errors) {
        return res.json(400, util.inspect(errors));
    }

    var now = (new Date()).getTime();
    db.incrby('global:nextReplyId', 1, function(err, rid){
        if (err) {
            return res.json(400, {msg: err});
        }

        db.zadd('topic:' + req.params.tid + ':replies', now, rid);
        var reply = {
            id: rid,
            content: req.sanitize('content'),
            created_at: now,
            create_by: req.user.name,
            avatar: req.user.avatar
        };

        db.hmset('reply:' + rid, topic, function(err, res){
            if (err) {
                return res.json(400, {msg: err});
            }
            return res.json({msg: res});
        });
    });
};
