# About typetypetype

![type home](https://user-images.githubusercontent.com/52224377/107892717-9f5de480-6eec-11eb-9d7b-5688af372027.PNG)

Link: https://typetypetype-webapp.herokuapp.com/

*typetypetype* is a full-stack web app built with the PERN stack (PostgreSQL, Express, React and Node.js) and deployed on Heroku. The app calculates and displays WPM and Accuracy as a user takes the typing speed test. The app also displays a table of all submitted scores on the Leaderboard page.

Each time a correct character is typed, the character fades away. If an incorrect character is typed, the character turns red and the user cannot progress until the correct character is entered.

Once the test is completed, a pop-up window displays the final WPM, Accuracy percentage, and # of mistakes made. The user can then enter their name and submit their scores. 

All submitted scores are stored in a PostgreSQL (Heroku Postgres) database. These scores are displayed on a sortable table on the Leaderboard page.

# Code

The main code for the front-end is in client/src/components. There are three .js files, one for each of the React components:

1) Header.js is the Header/Navigation Bar component, which is always displayed at the top of the page. The header includes a logo as well as links to the Homepage, the Leaderboard page, and this GitHub repository!
2) Home.js is the Home page component. The home page calculates and displays stats (WPM and Accuracy), a button to start and restart the test, and the text that the user has to type. Once a user submits their score, a POST request is made to the server with the data (user's name and their stats).
3) Leaderboard.js is the Leaderboard component, which displays a table of all scores that have been submitted. The scores are obtained by making a GET request to the server. The leaderboard table can be sorted by clicking on any of the table headers (e.g. Name).

The server (back-end) logic is in the server/index.js file. The file includes 3 main routes:

1) POST a new leaderboard score by querying the PostgreSQL database (when a user submits a test score)
2) GET all leaderboard scores by querying the PostgreSQL database (when a user visits the Leaderboard page)
3) A catch-all route that serves the index.html page. Since this app uses React Router DOM for front-end routing, this catch-all is necessary. Without it, the /leaderboard page (or any page besides the home page) would not work after a Refresh, or if a user visited the /leaderboard URL directly without having already been on the homepage. After the catch-all serves the index.html page, React takes over and performs the necessary routing to the Leaderboard page.

# Frameworks & Libraries 

PERN stack:

 - PostgreSQL (Heroku Postgres) - Database

 - Express - Back-end framework

 - React.js - Front-end framework. Used react-router-dom for front-end page routing.

 - Node.js - Back-end run-time environment

letteringJS - this library was used to place each character in the test text string into its own \<span> element. This allowed animations (fading out, changing color) to be performed on individual characters by applying CSS classes to each /<span> element based on whether the user input is correct or incorrect. Note that letteringJS requires jQuery. http://letteringjs.com/
  
momentJS - this library was used to format TIMESTAMPS from PostgreSQL (e.g. turns "2013-03-01T00:00:00+01:00" into "6/9/2014") to display on the Leaderboard page. https://momentjs.com/

Bootstrap - this library was to apply CSS styles to various HTML elements, primarily buttons and the table on the Leaderboard page. https://getbootstrap.com/

# Formula for WPM

The formula used to calculate WPM is 

![wpm formula](https://user-images.githubusercontent.com/52224377/107912580-5fb2ef00-6f24-11eb-9704-a0054cd5b642.PNG)

where Accuracy is 

![accuracy formula](https://user-images.githubusercontent.com/52224377/107912298-e9ae8800-6f23-11eb-8d49-496fc59e5df1.PNG)

Note that the reason for dividing by 5 in the WPM formula is that 5 characters is commonly used as the length of a "word" used when calculating WPM.

The formula I used is a modified version of the below formula for net WPM from https://www.speedtypingonline.com/typing-equations

![type formula](https://user-images.githubusercontent.com/52224377/107911670-9daf1380-6f22-11eb-89b4-1bb33e810cf1.png)

I did not use this net WPM formula directly because typetypetype does not allow you to progress with an incorrect character, thus there would never be more than 1 Uncorrected Error.
