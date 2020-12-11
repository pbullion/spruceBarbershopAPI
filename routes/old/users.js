const { Router } = require('express');
const pool = require('../db');

const router = Router();

router.get('/', (request, response, next) => {
    pool.query('SELECT * FROM users ORDER BY id ASC', (err, res) => {
        if (err) return next(err);
        response.json(res.rows);
    });
});

router.get('/:id', (request, response, next) => {
    const { id } = request.params;
    pool.query('SELECT * FROM users WHERE id = $1', [id], (err, res) => {
        if (err) return next(err);
        response.json(res.rows);
    });
});

//check if a user already has an account
router.get('/email/:email', (request, response, next) => {
    const { email } = request.params;
    pool.query('SELECT * FROM users WHERE email = $1', [email], (err, res) => {
        if (err) return next(err);
        response.json(res.rows);
    });
});

router.get('/phone_number/:phone_number', (request, response, next) => {
    const { phone_number } = request.params;
    pool.query('SELECT * FROM users WHERE phone_number = $1', [phone_number], (err, res) => {
        if (err) return next(err);
        response.json(res.rows);
    });
});

router.delete('/:id', (request, response, next) => {
    const { id } = request.params;
    pool.query('DELETE FROM users WHERE id = $1', [id], (err, res) => {
        if (err) return next(err);
        response.redirect('/users');
    });
});

router.post('/', (request, response, next) => {
    const { first_name, last_name, email } = request.body;
    pool.query('SELECT * FROM users WHERE email = $1', [email], (err, res) => {
        if (err) return next(err);
        console.log("here is the length", res.rows.length);
        if (res.rows.length > 0) {
            response.redirect(`/users/email/${email}`);
        } else {
            pool.query(
                'INSERT INTO users(first_name, last_name, email, customer) VALUES($1, $2, $3, $4)',
                [first_name, last_name, email, true],
                (err, res) => {
                    if (err) return next(err);
                    response.redirect(`/users/email/${email}`);
                }
            );
        }
    });
});

router.post('/store-signup', (request, response, next) => {
    const { first_name, last_name, phone_number } = request.body;
    pool.query('SELECT * FROM users WHERE phone_number = $1', [phone_number], (err, res) => {
        if (err) return next(err);
        console.log("here is the length", res.rows.length);
        if (res.rows.length > 0) {
            response.redirect(`/users/phone_number/${phone_number}`);
        } else {
            pool.query(
                'INSERT INTO users(first_name, last_name, phone_number, customer) VALUES($1, $2, $3, $4)',
                [first_name, last_name, phone_number, true],
                (err, res) => {
                    if (err) return next(err);
                    response.redirect(`/users/phone_number/${phone_number}`);
                }
            );
        }
    });
});

router.post('/socialSignUp', (request, response, next) => {
    console.log(request.body);
    console.log(request.body.token);
    const { first_name, last_name, email, phone_number, pictureUrl, owner, staff, customer } = request.body.user;
    pool.query(
        'INSERT INTO users(first_name, last_name, email, phone_number, pictureUrl, owner, staff, customer, expo_token, shop) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
        [first_name, last_name, email, phone_number, pictureUrl, owner, staff, customer, request.body.token, false],
        (err, res) => {
            console.log(res);
            if (err) return next(err);
            response.redirect(`/users/email/${email}`);
        }
    );
});

router.put('/socialSignUp', (request, response, next) => {
    console.log(request.body.user.email);
    console.log(request.body.token);
    pool.query(
        'UPDATE users SET expo_token = $1 WHERE email = $2',
        [request.body.token, request.body.user.email],
        (err, res) => {
            console.log("err", err);
            console.log("res", res);
            console.log("res", request.body.user.email);
            if (err) return next(err);
            response.redirect(`/users/email/${request.body.user.email}`);
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
            `UPDATE users SET ${field}=($1) WHERE id=$2`,
            [request.body[field], id],
            (err, res) => {
                if (err) return next(err);
                if (index === fields.length -1) response.redirect('/users');
            }
        )
    });
});

module.exports = router;
