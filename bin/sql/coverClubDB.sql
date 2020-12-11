DROP TABLE users, clubs;

CREATE TABLE users(
  id serial,
  name character varying(50),
  email character varying(50),
  phone_number character varying(50),
  pictureUrl character varying(200),
  birthday DATE,
  venmo character varying(200),
  clubs text[],
  bets text[]
);

CREATE TABLE clubs(
  id serial,
  name character varying(50),
  weekly_amount character varying(50),
  club_length character varying(50),
  leader character varying(50),
  current_week character varying(50),
  current_better character varying(50),
  members text[],
  betting_order text[],
  previous_bets text[],
  current_bets text[],
);

INSERT INTO users(name, email, phone_number, birthday, venmo, clubs, bets)
VALUES
('Patrick Bullion','pbullion@gmail.com','4093443814', '07/11/1986', 'https://venmo.com/code?user_id=1761698973220865011', '[2,3]', '{gameId: 6969420,betterId: 3,league: 'NFL',moneylineWinner: null,moneylineBet: null,moneylineOdds: null,moneylineToWin: null,spreadWinner: null,spreadBet: null,spreadOdds: null,spreadToWin: null,spreadAmt: null,overUnderTotal: null,overUnderType: null,overUnderBet: null,overUnderOdds: null,overUnderToWin: null,date: null,week: null}'),
