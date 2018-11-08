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

CREATE TABLE services(
  id serial,
  type character varying(50),
  category character varying(50),
  name character varying(50),
  description text[],
  price int,
  time int
);

INSERT INTO services(type, category, name, description, price, time)
VALUES
('Barber', 'Hair', 'Spruce Haircut', '{"Personal consultation", "Tailored cut", "Steamed Towel", "Precision edge up with straight razor", "Refreshing Shampoo", "Finishing touch style"}', 3000, 30),
('Barber', 'Hair', 'Basic Buzz', '{"Personal consultation", "Cut with clippers only", "Steamed Towel", "Precision edge up with straight razor", "Refreshing Shampoo", "Finishing touch style"}', 2000, 20),
('Barber', 'Hair', 'PG Cut (13 & under)', '{"Cut and style", "Steamed Towel"}', 2500, 25),
('Barber', 'Hair', 'Hair of the Dog', '{"In between cut clean up", "(neck, around ears, temples and sideburns)", "Precision edge up with straight razor"}', 1000, 10),
('Barber', 'Coloring', 'Camouflage', '{"Remove years with out grey camouflage coloring", "Blends Grey while leaving natural look"}', 3500, 35),
('Barber', 'Coloring', 'Full Color', '{"Prices vary based on process, amount of hair etc.", "Full coverage color"}', 6000, 60),
('Barber', 'Beard', 'Spruce Beard Trim', '{"Personal consultation", "Beard Shape, Trim", "Beard Conditioning Mask", "Steamed Towel", "Precision edge up with straight razor"}', 2400, 24),
('Barber', 'Beard', 'Basic Beard Trim', '{"Personal consultation", "Beard Shape, Trim", "Precision neck shave with trimmers"}', 1200, 12),
('Barber', 'Beard', 'Beard Mask/Blow Out', '{"Steamed Towel", "Beard conditioning treatment mask (Olaplex)", "Beard blow out"}', 1500, 15),
('Barber', 'Shave', 'Spruce Shave', '{"Steamed Towel", "Beard conditioning treatment mask (Olaplex)", "Beard blow out"}', 5000, 60),
('Barber', 'Shave', 'Head Shave', '{"Personal consultation", "Pre Shave Lather", "Series of Steamed Towels", "Precision Full Head, Neck shave with straight razor", "Refreshing Shampoo", "Energizing Cold Towel", "After Shave Treatment"}', 3500, 35),
('Barber', 'Shave', 'Basic Shave', '{"Steamed Towel", "Pre Shave Lather", "Classic Shave with straight razor that goes with the grain", "After Shave Treatment"}', 3500, 35),
('Barber', 'Additional', 'Back Chest Wax', '{"Pre epilation", "Wax back or chest", "Post epilation", "Price varies on amount of hair removed"}', 1500, 15),
('Barber', 'Additional', 'Man Wax', '{"Pre epilation", "Wax of ears, nose, eye brows", "Shaping of eye brows", "Post epilation"}', 1200, 15),
('Barber', 'Additional', 'Basic Wax', '{"Pre epilation", "Wax/Shape Eye Brow", "Post epilation"}', 500, 10),
('Barber', 'Additional', 'Black Mask', '{" Removes dirt, black heads and impurities, absorbs excess oil and reveals a healthy, glowing complexion.", "Steamed Towel", "Application of Black Mask", "Removal of Black Mask"}', 1000, 10),
('Barber', 'Additional', '24k Gold Mask', '{"Instantly imporves the appearance of fine lines and wrinkles with caffeine, collagen, and gold for a youtful-looking complexion.", "Steamed Towel", "Application of 24k Gold Mask", "Removal of 24k Gold Mask"}', 1500, 15),
('Barber', 'Additional', 'Ear Candling', '{"Ear candeling is a practice in which a hollow candle is inserted into the external auditory canal and lit, with the patient lying on the opposite ear the combination of heat and suction removes earwax.", "Application and Removal of Candle in each ear."}', 1500, 15);

INSERT INTO users(first_name, last_name, email, phone_number, pictureUrl, owner, staff, customer)
VALUES
('Owner','User','owner@gmail.com','4093443814', 'https://lh3.googleusercontent.com/-5iIqTS4qU_o/AAAAAAAAAAI/AAAAAAAAAIw/UugE0cC2NHI/photo.jpg', true,  false, false),
('Staff','User','staff@gmail.com','4093443814', 'https://lh3.googleusercontent.com/-5iIqTS4qU_o/AAAAAAAAAAI/AAAAAAAAAIw/UugE0cC2NHI/photo.jpg', false, true, false),
('Customer','User','customer@gmail.com','4093443814', 'https://lh3.googleusercontent.com/-5iIqTS4qU_o/AAAAAAAAAAI/AAAAAAAAAIw/UugE0cC2NHI/photo.jpg', false, false, true);
