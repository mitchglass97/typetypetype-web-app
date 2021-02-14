/* These are the commands that were used to create the PostgreSQL database and table via Heroku Postgres*/

CREATE DATABASE typetypetype;

CREATE TABLE typeTable (
		id BIGSERIAL NOT NULL PRIMARY KEY,
		posting_date DATE NOT NULL DEFAULT CURRENT_DATE,
		user_name VARCHAR (60),
		WPM NUMERIC(7,2) NOT NULL,
		accuracy NUMERIC(7,2)
	);