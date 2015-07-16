use punchsystem;

var compid = 1;
var userList = db.users.find({compid:compid});

var userIdList = userList.toArray().map(function(u){ return u.userid });

userIdList

var results = db.records.aggregate([
        { $match: { userid: { $in: userIdList } } },
        { $group: { 
                _id: { rate: '$hourlyRate', userid:'$userid' }, 
                totalIn: { $sum: '$inDate' }, 
                totalOut: { $sum: '$outDate' },
                from: {$first: '$inDate'},
                to: {$last: '$outDate'} 
            } 
        },
        { $group: {
                _id: { userid: "$_id.userid" },
                from: { $first: "$from" },
                to: { $last: '$to' },
                totalHours: { $sum : {$subtract: ['$totalOut', '$totalIn'] } },
                rates: { $push : { rate: '$_id.rate' } }
            }
        },
        { $project: {
                userid: "$_id.userid",
                from: '$from',
                to: '$to',
                totalHours: '$totalHours',
                rates: '$rates',
                _id: 0
            }
        }
]).toArray();

var resultsList = results.map(function(r) { return r; });

resultsList;

