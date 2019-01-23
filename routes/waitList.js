const { Router } = require('express');
const pool = require('../db');
const moment = require('moment');

const router = Router();

//all customers waiting and NOT in progress
router.get('/', (request, response, next) => {
    const todaysDate = moment().utcOffset('-06:00').format('L');    pool.query('select *, u_staff.first_name staff_first_name, u_staff.last_name staff_last_name, u_customer_name.first_name customer_first_name, u_customer_name.last_name customer_last_name, w.id waitlistid from waitlist w inner join users u_customer_name on w.userid=u_customer_name.id inner join services s on w.serviceid=s.id left  join staff on w.staffid=staff.id left join users u_staff on staff.userid=u_staff.id WHERE date = $1 AND waiting = true or in_progress = true order by w.id', [todaysDate], (err, res) => {
        if (err) return next(err);
        response.json(res.rows);
    });
});

router.get('/staffmember/:id', (request, response, next) => {
    const todaysDate = moment().utcOffset('-06:00').format('L');
    console.log("staff id todays date", todaysDate);
    const { id } = request.params;
    pool.query('select *, u_staff.first_name staff_first_name, u_staff.last_name staff_last_name, u_customer_name.first_name customer_first_name, u_customer_name.last_name customer_last_name, w.id waitlistid from waitlist w inner join users u_customer_name on w.userid=u_customer_name.id inner join services s on w.serviceid=s.id left  join staff on w.staffid=staff.id left join users u_staff on staff.userid=u_staff.id WHERE date = $1 AND w.staffid = $2 and waiting = true or date = $1 AND w.staffid = $2 and in_progress = true order by w.id', [todaysDate, id], (err, res) => {
        if (err) return next(err);
        response.json(res.rows);
    });
});

//all customers in progress
// router.get('/inProgressList', (request, response, next) => {
//     const todaysDate = moment().utcOffset('-06:00').format('L');
//     pool.query('select *, u_staff.first_name staff_first_name, u_staff.last_name staff_last_name, u_customer_name.first_name customer_first_name, u_customer_name.last_name customer_last_name, w.id waitlistid from waitlist w inner join users u_customer_name on w.userid=u_customer_name.id inner join services s on w.serviceid=s.id left  join staff on w.staffid=staff.id left join users u_staff on staff.userid=u_staff.id WHERE date = $1 AND in_progress = true ORDER BY w.id', [todaysDate], (err, res) => {
//         if (err) return next(err);
//         response.json(res.rows);
//     });
// });

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
    const join_time = moment().utcOffset('-06:00').format('h:mm a');
    const todaysDate = moment().utcOffset('-06:00').format('L');
    //leave in for now for testing
    console.log("join time post", join_time);
    console.log("todays date post", todaysDate);
    pool.query(
        'INSERT INTO waitlist(userid, serviceid, staffid, waiting, date, join_time) VALUES($1, $2, $3, $4, $5, $6)',
        [request.body.currentUser.id, request.body.waitList.service.id, request.body.waitList.staff.id, true, todaysDate, join_time],
        (err, res) => {
            if (err) return next(err);
            response.redirect(`/waitList`);
        }
    );
});

router.put('/start/:id', (request, response, next) => {
    const { id } = request.params;
    const currentTime = moment().utcOffset('-06:00').format('h:mm a');
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
    const currentTime = moment().utcOffset('-06:00').format('h:mm a');
    pool.query(
        `UPDATE waitlist SET in_progress=false, end_time=$1, done=true WHERE id=$2`,
        [currentTime, id],
        (err, res) => {
            if (err) return next(err);
            console.log(err);
            response.redirect(`/waitList`);
        }
    )
});

module.exports = router;
