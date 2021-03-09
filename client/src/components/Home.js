// Home page
// Displays the text that user will type for the typing speed test.
// Displays stats (WPM and Accuracy) and calculates stats on each keystroke.
// Displays a button for user to start the test. This button also serves as a Restart button after test is completed.

// As user types, each character input is compared to the "current" character of the testText string. If the
// user-inputted character is correct, the character fades away via CSS animation. If the letter is wrong,
// the character turns red.

// After test is done, user is prompted to enter their name. After submitting name, their score and name is sent
// to the database via a POST request. The scores are viewable on a sortable table on the Leaderboard page.

import React, { Fragment, useEffect, useState } from "react";
import $ from "jquery"; // need jquery to use lettering.js library
import lettering from "letteringjs"; // lettering.js library, used to animate individual letters by turning each character in a text string into its own <span> element

const testText =
	"Jim and Anne will be in charge of the spring field day to be held in early June. They will ask their friends' aid to get set up. There will be games for the boys and girls. The children will want to hike, ride their bikes, and swim. This yearly event will be held in the new Peach Grove Park. Ruth has work to do on the plans for food for the day. Last year Ruth spent most of her time helping the two cooks with many snacks. Hot dogs, fries, soft drinks, ice cream, and candy apples were big sellers. Apple pie and ice cream sold well too. I hope Ruth serves the same food this year. George Long will hire the band and singer for the day. A great jazz band will play. George's mom leads the group. The jazz band is sure to be one of the big hits. George is to have them play from one to four and also in the evening. The fine songs they will play are sure to please all of us. Nice gifts will be given to all of the winners in each of the events. Local news coverage will include television and newspapers. Joyce Scott will take care of the pictures for the school paper and yearbook. Maybe the national news will do a short story on the tenth annual spring field day. The jazz band is sure to be one of the big hits.";
let buttonText = "Click to Start";
let begin = false; // boolean variable used to track whether the test has begun
let currChar = 0; // tracks the current character, which is used to iterate through testText. increment ONLY when user enters the correct character
let charsTyped = 0; // total # of keystrokes
let mistakeCount = 0; // # of incorrect keystrokes
let seconds = -3; // initialize to -3 for 3-second countdown. begin test when seconds = 0. end when seconds = 60.
let leaderboardCheck = false;
let restart = false;
let timerBool = false; // boolean for when timer is started (otherwise can create multiple timers by spamming button)
var myTimer = null; // used to create timer via setInterval. Have to initialize outside of component so we can clearInterval in useEffect when component is unmounted.

const Home = () => {
	// state variables, displayed on the page in <button> and <span> elements
	// values updated in the Update() function
	const [buttonText, updateButtonText] = useState("Click to Start");
	const [wpmValue, updateWPMValue] = useState(0);
	const [accuracy, updateAccuracy] = useState(0);

	// triggered when component is mounted.
	// return function is triggered when component is unmounted
	useEffect(() => {
		// initialize variables on component mount
		updateButtonText("Click to Start");
		begin = false;
		currChar = 0;
		charsTyped = 0;
		mistakeCount = 0;
		seconds = -3;
		leaderboardCheck = false;
		restart = false;
		timerBool = false;

		// clear the timer on unmount
		return () => clearInterval(myTimer);
	}, []);

	// Update() calculates stats (WPM and Accuracy) and updates the state variables "wpmValue" and "accuracy",
	// updates the "buttonText" state variable based on how much time is left in the test,
	// sends a POST request with user's data (name and scores) when test is over and user has submitted a name
	// function is called every 1 second, and whenever user enters a keystroke during the test.
	function update() {
		// Calculate stats (WPM and Accuracy)
		let tempAccuracy = (charsTyped - mistakeCount) / charsTyped;
		let tempWPM = 0;
		if (begin) {
			// calculate accuracy
			if (isNaN(tempAccuracy)) {
				tempAccuracy = 0;
			}
			tempAccuracy = Math.round(100 * tempAccuracy);
			updateAccuracy(tempAccuracy);

			// calculate WPM
			if (seconds > 60) {
				seconds = 60;
			}
			if (currChar > 0 && seconds > 0) {
				tempWPM = currChar / 5 / (seconds / 60);
				tempWPM = Math.round(
					(tempWPM * tempAccuracy) / 100
				);
				updateWPMValue(tempWPM);
			}
		}

		// update buttonText (shows time left)
		if (seconds < 0) {
			let tempseconds = Math.abs(seconds);
			updateButtonText(
				"Test begins in " + tempseconds + "..."
			);
		} else if (seconds == 0) {
			updateButtonText("1:00");
		} else if (seconds <= 50) {
			updateButtonText("0:" + (60 - seconds));
		} else if (seconds < 60) {
			updateButtonText("0:0" + (60 - seconds));
		}
		// timer is done
		else {
			restart = true;
			if (leaderboardCheck == false) {
				updateButtonText("0:00");

				// pop-up window when  test is done. show results of test and
				// prompt user for a name. if user enters a name and submits form, then send the data to server via a POST request
				let userInput = window.prompt(
					"Good job! Here are your final stats.\nWPM (Words Per Minute): " +
						tempWPM +
						"\nAccuracy: " +
						tempAccuracy +
						"% (" +
						mistakeCount +
						" incorrect characters out of " +
						charsTyped +
						" total keystrokes)\nEnter your name below to be added to the leaderboard!"
				);
				if (userInput != null) {
					const data = {
						user_name: userInput,
						WPM: tempWPM,
						accuracy: tempAccuracy,
					};
					fetch(
						"https://typetypetype-webapp.herokuapp.com/leaderboard",
						{
							method: "POST",
							headers: {
								"Content-Type":
									"application/json",
							},
							body: JSON.stringify(
								data
							),
						}
					)
						.then((response) =>
							response.json()
						)
						.then((data) => {
							console.log(
								"Success:",
								data
							);
						})
						.catch((error) => {
							console.error(
								"Error:",
								error
							);
						});
				}
			}
			updateButtonText("RESTART");
			leaderboardCheck = true;
		}
	}

	// 1 second timer
	function countSecond() {
		seconds++;
		update();
		// set begin to true after 3 second countdown (because seconds initialized to -3)
		if (seconds == 0 && begin === false) {
			begin = true;
		}
	}

	// function when button is clicked
	function testButton() {
		// start timer the first time button is clicked
		if (timerBool === false) {
			myTimer = setInterval(countSecond, 1000); // create a 1-second timer
			$(".fancy").lettering(); // lettering.js library. turns every character in string into a <span> element so they can be inidivudally animated
		}
		timerBool = true;
		if (restart) {
			window.location.reload(false); // refresh page if user clicks button after test has ended
		}
		update();
	}

	// listen for input (key strokes)
	document.onkeypress = function (e) {
		// don't do anything with keystrokes until test has begun
		if (begin) {
			charsTyped++; // increment total character count

			// Compare user-inputted character to the current character in the testText string
			// User has entered the correct character
			if (e.key == testText[currChar]) {
				document.getElementsByClassName(
					`char${currChar + 1}`
				)
					.item(0)
					.classList.remove("incorrectCharacter");
				document.getElementsByClassName(
					`char${currChar + 1}`
				)
					.item(0)
					.classList.add("correctCharacter");
				currChar++; // increment the current character
				update();
			}
			// User has entered the incorrect character
			else {
				mistakeCount++;
				document.getElementsByClassName(
					`char${currChar + 1}`
				)
					.item(0)
					.classList.add("incorrectCharacter");
				update();
			}
		}
	};

	return (
		<Fragment>
			<div
				id='home-container'
				class='d-flex flex-column align-items-center'
			>
				<div id='sentence' class='dark fancy'>
					<p id='sentence-text'>{testText}</p>
				</div>
				<div id='stats-container'>
					<div id='stats'>
						<ul id='stats-list'>
							<li>
								<button
									type='button'
									class='btn-test'
									onClick={
										testButton
									}
								>
									<span id='timer'>
										{
											buttonText
										}
									</span>
								</button>
							</li>
							<li class='blur'>
								WPM:{" "}
								<span id='wpm'>
									{
										wpmValue
									}
								</span>
							</li>
							<li class='blur'>
								Accuracy:{" "}
								<span id='accuracy'>
									{
										accuracy
									}
									%
								</span>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</Fragment>
	);
};

export default Home;
