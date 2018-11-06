CREATE TABLE users(
  id serial,
  first_name character varying(50),
  last_name character varying(50),
  email character varying(50),
  phone_number character varying(50),
  pictureUrl character varying(200),
  owner boolean,
  staff boolean,
  customer boolean
);


INSERT INTO users(first_name, last_name, email, phone_number, pictureUrl, owner, staff, customer)
VALUES
('Owner','User','owner@gmail.com','4093443814', 'https://lh3.googleusercontent.com/-5iIqTS4qU_o/AAAAAAAAAAI/AAAAAAAAAIw/UugE0cC2NHI/photo.jpg', true,  false, false),
('Staff','User','staff@gmail.com','4093443814', 'https://lh3.googleusercontent.com/-5iIqTS4qU_o/AAAAAAAAAAI/AAAAAAAAAIw/UugE0cC2NHI/photo.jpg', false, true, false),
('Customer','User','customer@gmail.com','4093443814', 'https://lh3.googleusercontent.com/-5iIqTS4qU_o/AAAAAAAAAAI/AAAAAAAAAIw/UugE0cC2NHI/photo.jpg', false, false, true);
