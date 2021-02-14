# About typetypetype

![typetypetype picture](https://user-images.githubusercontent.com/52224377/107892483-f82c7d80-6eea-11eb-8457-43ff33300b9d.PNG)

*typetypetype* is a full-stack web app built with the PERN stack (PostgreSQL, Express, React and Node.js). The app keeps running stats of WPM and Accuracy as a user takes the typing speed test. Each instance of the test lasts 60 seconds.

Each time a correct character is typed, the character fades away. If an incorrect character is typed, the character turns red and the user cannot progress until the correct character is entered.

Once the test is completed, a pop-up window displays the final WPM, Accuracy percentage, and # of mistakes made. The user can then enter their name and submit their scores. 

All submitted scores are stored in a PostgreSQL (Heroku Postgres) database. These scores are displayed on a sortable table on the Leaderboard page.

# Code

The main code for the front-end is in client/src/components. There are three .js files, one for each of the React components:

1) Header.js is the Header/Navigation Bar component, which is always displayed at the top of the page. The header includes a logo as well as links to the Homepage, the Leaderboard page, this GitHub repository.
2) Home.js is the Home page component. The home page displays stats (WPM and Accuracy), a button to start and restart the test, and the text that the user has to type. Once a user submits their score, a POST request is made to the server with the data (user's name and their stats).
3) Leaderboard.js is the Leaderboard component, which displays a table of all scores that have been submitted. The scores are obtained by making a GET request to the server. The leaderboard table can be sorted by clicking on any of the table headers (e.g. Name).

The server (back-end) logic is in the server/index.js file. The file includes 3 main routes:

1) POST a new leaderboard score by querying the PostgreSQL database (when a user submits a test score)
2) GET all leaderboard scores by querying the PostgreSQL database (when a user visits the Leaderboard page)
3) A catch-all route that serves the index.html page. Since this app uses React Router DOM for front-end routing, this catch-all is necessary. Without it, the /leaderboard page (or any page besides the home page) would not work after a Refresh, or if a user visited the /leaderboard URL directly without having already been on the homepage. After the catch-all serves the index.html page, React takes over and performs the necessary routing to the Leaderboard page.

# Libraries

letteringJS - this library was used to used to animate individual letters by turning each character in a text string into its own <span> element. The animation (fade and change color) is then performed by applying the "correct" or "incorrect" CSS classes to each span element. Note that letteringJS requires jQuery. http://letteringjs.com/
  
momentJS - this library was used to format TIMESTAMPS from PostgreSQL (e.g. turns "2013-03-01T00:00:00+01:00" into "6/9/2014") to display on the Leaderboard page. https://momentjs.com/

Bootstrap - this library was used for various CSS styles, primarily buttons and the table on the Leaderboard page. https://getbootstrap.com/