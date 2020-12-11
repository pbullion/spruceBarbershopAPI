const { Router } = require('express');
const pool = require('../db');
const moment = require('moment');

const router = Router();

router.get('/', (request, response, next) => {
    pool.query('SELECT *, staff.id staffid FROM users INNER JOIN staff ON users.id = staff.userID order by staffid', (err, res) => {
        if (err) return next(err);
        response.json(res.rows);
    });
});
router.get('/working', (request, response, next) => {
    pool.query('SELECT *, staff.id staffid FROM users INNER JOIN staff ON users.id = staff.userID where staff.appt_only = false order by staffid', (err, res) => {
        if (err) return next(err);
        const start = moment().utcOffset('-06:00').format("dddd").toLowerCase() + "_start";
        const end = moment().utcOffset('-06:00').format("dddd").toLowerCase() + "_end";
        const now = moment().utcOffset('-06:00').format('HH:mm:ss');
        const newResponse = [];
        for (let i = 0; i < res.rows.length; i++) {
            if (now > res.rows[i][start] && now < res.rows[i][end]) {
                res.rows[i].isWorking = true
            } else {
                res.rows[i].isWorking = false
            }
            newResponse.push(res.rows[i])
        }
        response.json(newResponse);
    });
});

router.get('/:id', (request, response, next) => {
    const { id } = request.params;
    pool.query('SELECT * FROM staff WHERE id = $1', [id], (err, res) => {
        if (err) return next(err);
        response.json(res.rows);
    });
});

router.get('/list/:category', (request, response, next) => {
    const { category } = request.params;
    if (category === 'stylist') {
        pool.query('SELECT * FROM users INNER JOIN staff ON users.id = staff.userID WHERE stylist = true', (err, res) => {
            if (err) return next(err);
            response.json(res.rows);
        });
    } else {
        pool.query('SELECT * FROM users INNER JOIN staff ON users.id = staff.userID WHERE barber = true', (err, res) => {
            if (err) return next(err);
            response.json(res.rows);
        });
    }
});

router.get('/email/:email', (request, response, next) => {
    const { email } = request.params;
    pool.query('SELECT * FROM staff WHERE email = $1', [email], (err, res) => {
        if (err) return next(err);
        response.json(res.rows);
    });
});

router.delete('/:id', (request, response, next) => {
    const { id } = request.params;
    pool.query('DELETE FROM staff WHERE id = $1', [id], (err, res) => {
        if (err) return next(err);
        response.redirect('/staff');
    });
});

router.post('/', (request, response, next) => {
    const { first_name, last_name, email, phone_number, pictureUrl, owner, staff, customer } = request.body.user;
    pool.query(
        'INSERT INTO staff(first_name, last_name, email, phone_number, pictureUrl, owner, staff, customer) VALUES($1, $2, $3, $4, $5, $6, $7, $8)',
        [first_name, last_name, email, phone_number, pictureUrl, owner, staff, customer],
        (err, res) => {
            if (err) return next(err);
            response.redirect(`/staff/email/${email}`);
        }
    );
});

router.put('/appointmentsFalse/:id', (request, response, next) => {
    const { id } = request.params;
    pool.query(
        `UPDATE staff SET appt_only = false WHERE id=$1`,
        [id],
        (err, res) => {
            if (err) return next(err);
            console.log(err);
            response.status(201).json({
                message: 'Successfully updated to false',
            })
        }
    )
});

router.put('/appointmentsTrue/:id', (request, response, next) => {
    const { id } = request.params;
    pool.query(
        `UPDATE staff SET appt_only = true WHERE id=$1`,
        [id],
        (err, res) => {
            if (err) return next(err);
            console.log(err);
            response.status(201).json({
                message: 'Successfully updated to true',
            })
        }
    )
});

module.exports = router;
