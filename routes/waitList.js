const { Router } = require('express');
const pool = require('../db');
var moment = require('moment');

const router = Router();

//all customers waiting and NOT in progress
router.get('/', (request, response, next) => {
    const todaysDate = moment().format('L');
    pool.query('select *, u_customer_name.first_name customer_first_name, u_customer_name.last_name customer_last_name, w.id waitlistid from waitlist w inner join users u_customer_name on w.userid=u_customer_name.id inner join services s on w.serviceid=s.id WHERE date = $1 AND waiting = true ORDER BY w.id', [todaysDate], (err, res) => {
        if (err) return next(err);
        response.json(res.rows);
    });
});

//all customers in progress
router.get('/inProgressList', (request, response, next) => {
    const todaysDate = moment().format('L');
    pool.query('select *, u_customer_name.first_name customer_first_name, u_customer_name.last_name customer_last_name, w.id waitlistid from waitlist w inner join users u_customer_name on w.userid=u_customer_name.id inner join services s on w.serviceid=s.id WHERE date = $1 AND in_progress = true ORDER BY w.id', [todaysDate], (err, res) => {
        if (err) return next(err);
        response.json(res.rows);
    });
});

// change this one to return the remaining service time in order
router.get('/remainingTimesInProgress', (request, response, next) => {
    const todaysDate = moment().format('L');
    pool.query('SELECT * FROM waitlist left JOIN users ON users.id = waitlist.userid left join staff ON waitlist.staffid = staff.userid left join services on waitlist.serviceid = services.id where in_progress = true AND date = $1', [todaysDate], (err, res) => {
        console.log(res.rows);
        if (err) return next(err);
        let i;
        let remainingTimesInProgress = [];
        for (i = 0; i < res.rows.length; i++) {
            let time = parseInt(moment(res.rows[i].start_time, "h:mm").fromNow(true), 10);
            if (!time) {
                time = 1;
            }
            let serviceTime = res.rows[i].time;
            let remainingTime = serviceTime - time;
            remainingTimesInProgress.push(remainingTime);
        }
        remainingTimesInProgress.sort(function(a, b){return a - b});
        response.json(remainingTimesInProgress);
    });
});

router.get('/:id', (request, response, next) => {
    const { id } = request.params;
    pool.query('SELECT * FROM waitlist WHERE id = $1', [id], (err, res) => {
        if (err) return next(err);
        response.json(res.rows);
    });
});

router.delete('/:id', (request, response, next) => {
    const { id } = request.params;
    pool.query('DELETE FROM waitlist WHERE id = $1', [id], (err, res) => {
        if (err) return next(err);
        response.redirect('/waitList');
    });
});

router.post('/', (request, response, next) => {
    const join_time = moment().format('h:mm a');
    const todaysDate = moment().format('L');
    if (request.body.waitList.staff.id > 0) {
        pool.query(
            'INSERT INTO waitlist(userid, serviceid, staffid, waiting, date, join_time) VALUES($1, $2, $3, $4, $5, $6)',
            [request.body.currentUser.id, request.body.waitList.service.id, request.body.waitList.staff.id, true, todaysDate, join_time],
            (err, res) => {
                if (err) return next(err);
                response.redirect(`/waitList`);
            }
        );
    } else {
        pool.query(
            'INSERT INTO waitlist(userid, serviceid, waiting, date, join_time) VALUES($1, $2, $3, $4, $5)',
            [request.body.currentUser.id, request.body.waitList.service.id, true, todaysDate, join_time],
            (err, res) => {
                if (err) return next(err);
                response.redirect(`/waitList`);
            }
        );
    }

});

router.put('/start/:id', (request, response, next) => {
    const { id } = request.params;
    const currentTime = moment().format('h:mm a');
    pool.query(
        `UPDATE waitlist SET in_progress=true, start_time=$1 , waiting=false WHERE id=$2`,
        [currentTime, id],
        (err, res) => {
            if (err) return next(err);
            response.redirect(`/waitList`);
        }
    )
});
router.put('/done/:id', (request, response, next) => {
    const { id } = request.params;
    pool.query(
        `UPDATE waitlist SET in_progress=false, end_time=CURRENT_TIME(2), done=true WHERE id=$1`,
        [id],
        (err, res) => {
            if (err) return next(err);
            console.log(err);
            response.redirect(`/waitList`);
        }
    )
});


// Do not need this
// router.get('/overallTimeInWaiting', (request, response, next) => {
//     const todaysDate = moment().format('L');
//     pool.query('SELECT SUM (time) as waitlisttime FROM waitlist left JOIN users ON users.id = waitlist.userid left join staff ON waitlist.staffid = staff.userid left join services on waitlist.serviceid = services.id where waiting = true AND date = $1', [todaysDate], (err, res) => {
//         if (err) return next(err);
//         response.json(parseInt(res.rows[0].waitlisttime, 10));
//     });
// });

// router.get('/overallTimeInProgress', (request, response, next) => {
//     const todaysDate = moment().format('L');
//     pool.query('SELECT * FROM waitlist left JOIN users ON users.id = waitlist.userid left join staff ON waitlist.staffid = staff.userid left join services on waitlist.serviceid = services.id where in_progress = true AND date = $1', [todaysDate], (err, res) => {
//         if (err) return next(err);
//         let i;
//         let totalLeftInProgress = 0;
//         for (i = 0; i < res.rows.length; i++) {
//             let time = parseInt(moment(res.rows[i].start_time, "h:mm").fromNow(true), 10);
//             if (!time) {
//                 time = 1;
//             }
//             let serviceTime = res.rows[i].time;
//             let remainingTime = serviceTime - time;
//             totalLeftInProgress += remainingTime;
//         }
//         response.json(totalLeftInProgress);
//     });
// });

// router.post('/testing', (request, response, next) => {
//     const join_time = moment().format('h:mm a');
//     const todaysDate = moment().format('L');
//
//     console.log(request.body);
//     console.log(join_time);
//     console.log(todaysDate);
//     pool.query(
//         'INSERT INTO waitlist(userid, serviceid, staffid, waiting, date, join_time) VALUES($1, $2, $3, $4, $5, $6)',
//         [request.body.currentUser.id, request.body.waitList.service.id, request.body.waitList.staff.id, true, todaysDate, join_time],
//         (err, res) => {
//             if (err) return next(err);
//             response.redirect(`/waitList`);
//         }
//     );
// });

module.exports = router;
