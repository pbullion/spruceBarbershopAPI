const { Router } = require('express');
const pool = require('../db');
var moment = require('moment');

const router = Router();

router.get('/', (request, response, next) => {
    pool.query('SELECT * FROM waitlist LEFT JOIN users ON users.id = waitlist.userid LEFT JOIN staff ON waitlist.staffid = staff.userid LEFT JOIN services on waitlist.serviceid = services.id', (err, res) => {
        if (err) return next(err);
        response.json(res.rows);
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
    pool.query(
        'INSERT INTO waitlist(userid, serviceid, staffid, staffname) VALUES($1, $2, $3, $4)',
        [request.body.currentUser.id, request.body.waitList.serviceID, request.body.waitList.staffMemberID, request.body.waitList.staffName],
        (err, res) => {
            if (err) return next(err);
            response.redirect(`/waitList`);
        }
    );
});
router.put('/start/:id', (request, response, next) => {
    const { id } = request.params;
        pool.query(
            `UPDATE waitlist SET in_progress=true, start_time=CURRENT_TIME(2) WHERE id=$1`,
            [id],
            (err, res) => {
                if (err) return next(err);
                response.redirect(`/waitList`);
            }
        )
    });
router.put('/done/:id', (request, response, next) => {
    const { id } = request.params;
        pool.query(
            `UPDATE waitlist SET in_progress=false, end_time=CURRENT_TIME(2) WHERE id=$1`,
            [id],
            (err, res) => {
                if (err) return next(err);
                console.log(err);
                response.redirect(`/waitList`);
            }
        )
    });

module.exports = router;
