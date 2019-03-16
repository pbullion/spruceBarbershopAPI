const { Router } = require('express');
const pool = require('../db');
const moment = require('moment');

const router = Router();

//all customers waiting and NOT in progress
router.get('/', (request, response, next) => {
    const todaysDate = moment().utcOffset('-05:00').format('L');
    pool.query('select *, u_staff.first_name staff_first_name, u_staff.last_name staff_last_name, u_customer_name.first_name customer_first_name, u_customer_name.last_name customer_last_name, w.id waitlistid from waitlist w inner join users u_customer_name on w.userid=u_customer_name.id inner join services s on w.serviceid=s.id left  join staff on w.staffid=staff.id left join users u_staff on staff.userid=u_staff.id WHERE date = $1 AND waiting = true or in_progress = true order by w.id', [todaysDate], (err, res) => {
        if (err) return next(err);
        response.json(res.rows);
    });
});

router.get('/staffmember/:id', (request, response, next) => {
    const todaysDate = moment().utcOffset('-05:00').format('L');
    const { id } = request.params;
    console.log(id);
    pool.query('select *, u_staff.first_name staff_first_name, u_staff.last_name staff_last_name, u_customer_name.first_name customer_first_name, u_customer_name.last_name customer_last_name, w.id waitlistid, service1.id service1_id, service1.type service1_type, service1.category service1_category, service1.name service1_name, service1.description service1_description, service1.price service1_price, service1.time service1_time, service2.id service2_id, service2.type service2_type, service2.category service2_category, service2.name service2_name, service2.description service2_description, service2.price service2_price, service2.time service2_time  from waitlist w inner join users u_customer_name on w.userid=u_customer_name.id inner join services service1 on w.service1id=service1.id left join services service2 on w.service2id=service2.id left join staff on w.staffid=staff.id left join users u_staff on staff.userid=u_staff.id WHERE date = $1 AND w.staffid = $2 and waiting = true or date = $1 AND w.staffid = $2 and in_progress = true order by w.id', [todaysDate, id], (err, res) => {
        if (err) return next(err);
        // console.log(res.rows);
        response.json(res.rows);
    });
});

router.get('/totals', (request, response, next) => {
    const todaysDate = moment().utcOffset('-05:00').format('L');
    pool.query('select *, u_staff.first_name staff_first_name, u_staff.last_name staff_last_name, u_customer_name.first_name customer_first_name, u_customer_name.last_name customer_last_name, w.id waitlistid from waitlist w inner join users u_customer_name on w.userid=u_customer_name.id inner join services s on w.serviceid=s.id left  join staff on w.staffid=staff.id left join users u_staff on staff.userid=u_staff.id WHERE date = $1 and waiting = true or date = $1 and in_progress = true order by w.id', [todaysDate], (err, res) => {
        if (err) return next(err);
        const waittimes = {};
        const staffid = [];
        const newStaffTimes = [];
        for (let i = 0; i < res.rows.length; i++) {
            if (res.rows[i].in_progress) {
                staffid.push(res.rows[i].staffid);
                waittimes[res.rows[i].staffid] = res.rows[i].time - parseInt(moment(res.rows[i].start_time, "HH:mm:ss").utcOffset('+6:00').fromNow(true), 10);
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
        response.status(201).json({
            message: 'Successfully Deleted',
        })
    });
});

router.post('/', (request, response, next) => {
    const join_time = moment().utcOffset('-05:00').format('HH:mm:ss');
    const todaysDate = moment().utcOffset('-05:00').format('L');
    console.log("current user", request.body.currentUser);
    // if (request.body.waitList.service2) {
    //     pool.query(
    //         'INSERT INTO waitlist(userid, service1id, service2id, staffid, waiting, date, join_time, mobile_join) VALUES($1, $2, $3, $4, $5, $6, $7, $8)',
    //         [request.body.currentUser.id, request.body.waitList.service1.id, request.body.waitList.service2.id, request.body.waitList.staff.id, true, todaysDate, join_time, request.body.waitList.mobile_join],
    //         (err, res) => {
    //             if (err) return next(err);
    //             response.redirect(`/waitList`);
    //         }
    //     );
    // } else {
    //     pool.query(
    //         'INSERT INTO waitlist(userid, service1id, service2id, staffid, waiting, date, join_time, mobile_join) VALUES($1, $2, $3, $4, $5, $6, $7, $8)',
    //         [request.body.currentUser.id, request.body.waitList.service1.id, 0, request.body.waitList.staff.id, true, todaysDate, join_time, request.body.waitList.mobile_join],
    //         (err, res) => {
    //             if (err) return next(err);
    //             response.redirect(`/waitList`)}
    //         )
    //         };
    pool.query(
        'SELECT * from waitlist WHERE date = $1 and userid = $2 and waiting = true',
        [todaysDate, request.body.currentUser.id],
        (err, res) => {
            if (err) return next(err);
            console.log("in the res");
            console.log(res.rows);
            if (res.rows.length > 0) {
                console.log("you are already on the list");
                response.json({message: "You are already on the list!"})
            } else {
                if (request.body.waitList.service2) {
                    console.log("in service two query");
                    pool.query(
                        'INSERT INTO waitlist(userid, service1id, service2id, staffid, waiting, date, join_time, mobile_join) VALUES($1, $2, $3, $4, $5, $6, $7, $8)',
                        [request.body.currentUser.id, request.body.waitList.service1.id, request.body.waitList.service2.id, request.body.waitList.staff.id, true, todaysDate, join_time, request.body.waitList.mobile_join],
                        (err, res) => {
                            if (err) return next(err);
                            response.redirect(`/waitList`);
                        }
                    );
                } else {
                    console.log("in service 1 query");
                    pool.query(
                        'INSERT INTO waitlist(userid, service1id, service2id, staffid, waiting, date, join_time, mobile_join) VALUES($1, $2, $3, $4, $5, $6, $7, $8)',
                        [request.body.currentUser.id, request.body.waitList.service1.id, 0, request.body.waitList.staff.id, true, todaysDate, join_time, request.body.waitList.mobile_join],
                        (err, res) => {
                            if (err) return next(err);
                            response.redirect(`/waitList`);
                        }
                    );
                }
            }
        }
    );
});

router.put('/start/:id', (request, response, next) => {
    const { id } = request.params;
    const currentTime = moment().utcOffset('-05:00').format('HH:mm:ss');
    pool.query(
        `UPDATE waitlist SET in_progress=true, start_time=$1 , waiting=false WHERE id=$2`,
        [currentTime, id],
        (err, res) => {
            response.status(201).json({
                message: 'Successfully Added',
            })
        }
    )
});

router.put('/socialSignUp', (request, response, next) => {
    pool.query(
        `UPDATE users SET expo_token = $1 WHERE id=$2`,
        [request.body.token, request.body.user.id],
        (err, res) => {
            if (err) return next(err);
            response.redirect(`/waitList`);
        }
    )
});

router.put('/done/:id', (request, response, next) => {
    const { id } = request.params;
    const currentTime = moment().utcOffset('-05:00').format('HH:mm:ss');
    pool.query(
        `UPDATE waitlist SET in_progress=false, end_time=$1, done=true WHERE id=$2`,
        [currentTime, id],
        (err, res) => {
            if (err) return next(err);
            console.log(err);
            response.status(201).json({
                message: 'Successfully Finished',
            })
        }
    )
});

module.exports = router;
