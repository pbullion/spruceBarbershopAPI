const { Router } = require('express');
const pool = require('../db');
const fetch = require('node-fetch');
const moment = require('moment');

const router = Router();

router.get('/', (request, response, next) => {
    pool.query('SELECT * FROM messages ORDER BY id asc', (err, res) => {
        if (err) return next(err);
        response.json(res.rows);
    });
});

router.post('/', (request, response, next) => {
    const { title, body, icon, iconColor } = request.body.message;
    const todaysDate = moment().utcOffset('-06:00').format('L');
    console.log(todaysDate);
    pool.query(
        'INSERT INTO messages(title, body, icon, iconColor, date) VALUES($1, $2, $3, $4, $5)',
        [title, body, icon, iconColor, todaysDate],
        (err, res) => {
            if (err) return next(err);
            response.status(201).json({
                message: 'Created message successfully',
            })
        }
    );
});

router.post('/sendMessage', (request, response, next) => {
    const { title, body } = request.body.message;
    pool.query(
        'SELECT * FROM users', (err, res) => {
            if (err) return next(err);
            // console.log(res);
            for (let i = 0; i < res.rows.length; i++) {
                let messages = [];
                if (!res.rows[i].expo_token) {
                    // console.log("its false", [i])
                } else {
                    // console.log(res.rows[i].expo_token);
                    messages.push({
                        "to": res.rows[i].expo_token,
                        "sound": "default",
                        "body": body,
                        "title": title,
                        "badge": 1
                    });
                    fetch('https://exp.host/--/api/v2/push/send', {
                        method: 'post',
                        headers: {
                            "accept": "application/json",
                            "content-type": "application/json"
                        },
                        body: JSON.stringify(messages)
                    })
                        .catch(reason => {
                            console.log(reason)
                        });
                }

            }
            response.status(201).json({
                message: 'Created message successfully',
            })
        }
    );
});


router.delete('/:id', (request, response, next) => {
    const { id } = request.params;
    console.log(id);
    pool.query('DELETE FROM messages WHERE id = $1', [id], (err, res) => {
        if (err) return next(err);
        response.status(201).json({
            message: 'Created message successfully',
        })    });
});

module.exports = router;
