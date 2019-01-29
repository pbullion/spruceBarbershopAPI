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
    const { id } = request.params;
    pool.query('select *, u_staff.first_name staff_first_name, u_staff.last_name staff_last_name, u_customer_name.first_name customer_first_name, u_customer_name.last_name customer_last_name, w.id waitlistid from waitlist w inner join users u_customer_name on w.userid=u_customer_name.id inner join services s on w.serviceid=s.id left  join staff on w.staffid=staff.id left join users u_staff on staff.userid=u_staff.id WHERE date = $1 AND w.staffid = $2 and waiting = true or date = $1 AND w.staffid = $2 and in_progress = true order by w.id', [todaysDate, id], (err, res) => {
        if (err) return next(err);
        response.json(res.rows);
    });
});

router.get('/totals', (request, response, next) => {
    const todaysDate = moment().utcOffset('-06:00').format('L');
    pool.query('select *, u_staff.first_name staff_first_name, u_staff.last_name staff_last_name, u_customer_name.first_name customer_first_name, u_customer_name.last_name customer_last_name, w.id waitlistid from waitlist w inner join users u_customer_name on w.userid=u_customer_name.id inner join services s on w.serviceid=s.id left  join staff on w.staffid=staff.id left join users u_staff on staff.userid=u_staff.id WHERE date = $1 and waiting = true or date = $1 and in_progress = true order by w.id', [todaysDate], (err, res) => {
        if (err) return next(err);
        const waittimes = {};
        const staffid = [];
        const newStaffTimes = [];
        for (let i = 0; i < res.rows.length; i++) {
            if (res.rows[i].in_progress) {
                staffid.push(res.rows[i].staffid);
                console.log("timememeee", res.rows[i].time);
                waittimes[res.rows[i].staffid] = res.rows[i].time - parseInt(moment(res.rows[i].start_time, "HH:mm:ss").utcOffset('+6:00').fromNow(true), 10);
                console.log("just the time diff", parseInt(moment(res.rows[i].start_time, "HH:mm:ss").utcOffset('+6:00').fromNow(true), 10));
                console.log("time remaining", parseInt(moment(res.rows[i].start_time, "HH:mm:ss").utcOffset('+6:00').fromNow(true), 10) - res.rows[i].time);
                if (!waittimes[res.rows[i].staffid]) {
                    waittimes[res.rows[i].staffid] = res.rows[i].time;
                }
            } else if (res.rows[i].waiting) {
                if (i === 0) {
                    staffid.push(res.rows[i].staffid);
                    waittimes[res.rows[i].staffid] = 0 + waittimes[res.rows[i].staffid];
                } else if (i === 1) {
                    waittimes[res.rows[i].staffid] = res.rows[i].time + waittimes[res.rows[i].staffid];
                } else {
                    waittimes[res.rows[i].staffid] = res.rows[i].time + waittimes[res.rows[i].staffid];
                }
            }
        }
        for (let i = 0; i < staffid.length; i++) {
            newStaffTimes.push({ time : {staffid: staffid[i], waittime: waittimes[staffid[i]]}});
        }
        newStaffTimes.sort(function (a, b) {
            return a.time.waittime - b.time.waittime
        });
        const lowestWait = {"lowestWait" : newStaffTimes[0]};
        response.json([lowestWait, newStaffTimes]);
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
    const join_time = moment().utcOffset('-06:00').format('h:mm a');
    const todaysDate = moment().utcOffset('-06:00').format('L');
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
