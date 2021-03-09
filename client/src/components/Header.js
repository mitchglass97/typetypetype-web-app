// Navigation bar on top of website
// Includes logo as well as links to Home, Leaderboard, and GitHub repo

import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import keyboardPicture from "./keyboard.PNG";

const Header = () => {
	return (
		<Fragment>
			<ul
				id='header'
				class='d-flex justify-content-between align-items-center'
			>
				<div>
					<li id='title'>
						<h1>
							<Link
								className='logo-link'
								to='/'
							>
								<img
									src={
										keyboardPicture
									}
								/>
								type
								<span class='dark'>
									type
								</span>
								type
							</Link>
						</h1>
					</li>
				</div>
				<div
					class='d-flex align-items-center'
					id='header-links'
				>
					<li>
						<Link
							className='text-link'
							to='/'
						>
							Home
						</Link>
					</li>
					<li>
						<Link
							className='text-link'
							to='/leaderboard'
						>
							Leaderboard
						</Link>
					</li>
					<li>
						<a
							className='text-link'
							href='https://github.com/mitchglass97/typetypetype-web-app'
						>
							GitHub Repo
						</a>
					</li>
				</div>
			</ul>
		</Fragment>
	);
};

export default Header;
