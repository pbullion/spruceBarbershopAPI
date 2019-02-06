const { Router } = require('express');
const pool = require('../db');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');

const router = Router();

router.post('/signup', (request, response, next) => {
    console.log(request.body.email);
    console.log(request.body.password);
    bcrypt.hash(request.body.password, null, null, (err, hash) => {
        if (err) {
            return response.status(500).json({
                error: err
            })
        }
    pool.query(
        'INSERT INTO admin(email, password) VALUES($1, $2)',
        [request.body.email, hash],
        (err, res) => {
            if (err) return next(err);
            response.status(201).json({
                message: "User Created",
                response: res
            });
        }
    );
    })
});

router.get('/login/:email/:password', (request, response, next) => {
    const { email, password } = request.params;
    console.log(request.params);
    pool.query('SELECT * FROM admin WHERE email = $1 and password = $2', [email, password], (err, res) => {
        if (err) return next(err);
        if (!res.rows[0]) return response.json({message: "incorrect email and or password"});
        response.json(res.rows[0]);
    });
});

router.get('/test/:email/:password', (request, response, next) => {
    const { email, password } = request.params;
    pool.query("SELECT * FROM admin where email = $1 and password = $2", [email, password],
        (err, res) => {
        console.log(err);
        if (err) return next(err);
        console.log("here is the response data", res.rows[0]);
        if (res.rows[0]) return response.json(res.rows[0]);
            // bcrypt.compare('7factor', res.rows[0].password, (err, result) => {
            //     if (err) {
            //         return response.status(401).json({
            //             message: 'Auth Failed'
            //         })
            //     }
            //     console.log('here is the result', result);
            //     if (result) {
            //         const token = jwt.sign(
            //             {
            //                 email: res.rows[0].email,
            //                 adminId: res.rows[0].id
            //             },
            //             'jwtsecretpasswordhaha',
            //             {
            //                 expiresIn: "12hr"
            //             }
            //         );
            //         return response.status(200).json({
            //             message: 'Auth successful',
            //             token: token
            //         })
            //     }
            //     response.status(401).json({
            //         message: 'Auth Failed'
            //     })
            // })
        })
        .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                })
            });
    });

module.exports = router;
