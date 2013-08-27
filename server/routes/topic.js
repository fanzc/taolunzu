var util = require('util');
var db = require('../db');

// Rex to extract at list
var atPattern = /@(\S+)/g;

/**
 * Return a topic list ordered by create time.
 *
 * schema: "/topics", method: get
 *
 * sorted set "user:%name:topics" with topic id, sort by latest_update_stamp
 * hash table "topics:%tid"
 * [
 *      {
 *       id: 1,
 *       content: "Hey, slow it down whataya want from me, whataya want from me",
 *       create_by: emrys,
 *       created_at: 1377138907,
 *       reply_count: 0,
 *       latest_update_stamp: 1377138907
 *      },
 *      ...
 *      {
 *
 *      }
 * ]
 *
 * @param {int} since_id
 * @param {int} count
 * @api public
 */
exports.getTopics = function(req, res) {
    var since_id = parseInt(req.query.since_id) || 0;
    // topic id should be positive integer(>0)
    db.zrank('user:' + req.user.username + ':topics', since_id, function(err, rank){
        if (err) {
            return res.json(404, {msg: err});
        }
        
        rank = rank || 0;
        var count = parseInt(req.query.count) || 20;
        db.zrange('user:' + req.user.username + ':topics', rank, rank+count, function(err, topicIds){
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

    });
};

// schema: "/topic/:tid", method: get
exports.getTopic = function(req, res){
    // make sure it's accessable
    db.zscore('user:' + req.user.username + 'topics', tid, function(err, score){
        if (err || !score) {
            return res.json(404, {msg: err});
        }
        db.hgetall('topic:' + req.params.tid, function(err, topic){
            if (err) {
                return res.json(404, {msg: err});
            }
            return res.json(topic);
        });
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

        var atList = req.param('content').match(atPattern);
        if (atList) {
            atList.forEach(function(at){
                var commenter = at.slice(1);
                db.exists('user:' + commenter, function(err, exists){
                    if (exists && commenter != req.user.username) {
                        db.zadd('user:' + commenter + ':topics', now, tid);
                    }
                });
            });
        }

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


/**
 * Return a repliy list sorted by create time. 
 *
 * schema: "/topic/:tid/replies" methods: get
 *
 * [
 *      {
 *       id: 1,
 *       content: "It's amazing",
 *       created_at: 13771389100,
 *       create_by: michael,
 *       avatar: http://api.upyun.com/v1/emrys.jpg
 *      },
 *      {
 *      ...
 *      }
 * ]
 *
 * @param {int} since_id
 * @param {int} count
 * @api public
 */
exports.getReplies = function(req, res) {
    var since_id = parseInt(req.query.since_id) || 0;
    var topicId = req.params.tid;
    db.zscore('user:' + req.user.username + ':topics', topicId, function(err, score){
        if (err || !score) {
            return res.json(404, {msg: err});
        }
        db.zrank('user:' + req.user.username + ':topics', since_id, function(err, rank){
            if (err) {
                return res.json(404, {msg: err});
            }
            rank = rank || 0;
            var count = parseInt(req.query.count) || 20;
            db.zrange('topic:' + topicId + ":replies", rank, rank+count, function(err, replyIds){
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
        });
    })
};

// schema: '/topic/:tid/reply/:rid' method: get
exports.getReply = function(req, res) {
    var replyId = req.params.rid;
    db.zscore('user:' + req.user.username + ':topics', req.params.tid, function(err, score){
        if (err || !score) {
            return res.json(404, {msg: err});
        }
        db.zscore('topic:' + req.params.tid + ':replies', replyId, function(err, score){
            if (err || !score) {
                return res.json(404, {msg: err});
            }
            db.hgetall('reply:' + replyId, function(err, reply){
                if (err) {
                    return res.json(400, {msg: err});
                } 
                return res.json(reply);
            });
        });
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

    db.zscore('user:' + req.user.username + ':topics', req.params.tid, function(err, score){
        if (err || !score) {
            return res.json(404, {msg: err});
        }

        var now = (new Date()).getTime();
        db.incrby('global:nextReplyId', 1, function(err, rid){
            if (err) {
                return res.json(400, {msg: err});
            }

            var atList = req.param('content').match(atPattern);
            if (atList) {
                atList.forEach(function(at){
                    var commenter = at.slice(1);
                    db.exists('user:' + commenter, function(err, exists){
                        if (exists && commenter != req.user.username) {
                            db.zadd('user:' + commenter + ':topics', now, req.params.tid);
                        }
                    });
                });
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
    });
};
