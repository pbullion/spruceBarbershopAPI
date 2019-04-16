const { Router } = require('express');
const pool = require('../db');

const router = Router();

router.get('/businessHours', (request, response, next) => {
    pool.query('SELECT * FROM business_hours ORDER BY id ASC', (err, res) => {
        if (err) return next(err);
        // console.log(response);
        response.json(res.rows);
    });
});

router.get('/specials', (request, response, next) => {
    pool.query('SELECT * FROM specials ORDER BY id ASC', (err, res) => {
        if (err) return next(err);
        // console.log(response);
        response.json(res.rows);
    });
});

router.get('/update', (request, response, next) => {
    pool.query('SELECT * FROM updates ORDER BY id ASC', (err, res) => {
        if (err) return next(err);
        // console.log(response);
        response.json(res.rows);
    });
});

module.exports = router;
