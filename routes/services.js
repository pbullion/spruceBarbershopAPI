const { Router } = require('express');
const pool = require('../db');

const router = Router();

router.get('/', (request, response, next) => {
    pool.query('SELECT * FROM services ORDER BY id ASC', (err, res) => {
        if (err) return next(err);
        console.log(response);
        response.json(res.rows);
    });
});

// router.get('/:id', (request, response, next) => {
//     const { id } = request.params;
//     pool.query('SELECT * FROM services WHERE id = $1', [id], (err, res) => {
//         if (err) return next(err);
//         response.json(res.rows);
//     });
// });

router.get('/category/:category', (request, response, next) => {
    const { category } = request.params;
    pool.query('SELECT * FROM services WHERE category = $1', [category], (err, res) => {
        if (err) return next(err);
        response.json(res.rows);
    });
});

router.get('/email/:email', (request, response, next) => {
    const { email } = request.params;
    pool.query('SELECT * FROM services WHERE email = $1', [email], (err, res) => {
        if (err) return next(err);
        response.json(res.rows);
    });
});

router.delete('/:id', (request, response, next) => {
    const { id } = request.params;
    pool.query('DELETE FROM services WHERE id = $1', [id], (err, res) => {
        if (err) return next(err);
        response.redirect('/services');
    });
});

router.post('/', (request, response, next) => {
    const { first_name, last_name, email, phone_number, pictureUrl, owner, staff, customer } = request.body.user;
    pool.query(
        'INSERT INTO services(first_name, last_name, email, phone_number, pictureUrl, owner, staff, customer) VALUES($1, $2, $3, $4, $5, $6, $7, $8)',
        [first_name, last_name, email, phone_number, pictureUrl, owner, staff, customer],
        (err, res) => {
            if (err) return next(err);
            response.redirect(`/services/email/${email}`);
        }
    );
});

router.put('/:id', (request, response, next) => {
    const { id } = request.params;
    const keys = ['name', 'personality'];
    const fields = [];

    keys.forEach(key => {
        if (request.body[key]) fields.push(key);
    });

    fields.forEach((field, index) => {
        pool.query(
            `UPDATE services SET ${field}=($1) WHERE id=$2`,
            [request.body[field], id],
            (err, res) => {
                if (err) return next(err);
                if (index === fields.length -1) response.redirect('/services');
            }
        )
    });
});

module.exports = router;
