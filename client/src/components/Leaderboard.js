// Leaderboard page
// Displays a table of all scores that have been submitted by users.
// The scores data is obtained by making a GET request to the server. The server then queries the PostgreSQL database.
// Table columns are: Name, WPM, Accuracy, Date
// The table can be sorted by clicking on any of the column headers, which are buttons (e.g. Name)

import React, {Fragment, useEffect, useState } from 'react';
import moment from "moment"; // used to format TIMESTAMPS from postgreSQL e.g. turns "2013-03-01T00:00:00+01:00" into "6/9/2014" .. https://devhints.io/moment

const Leaderboard = () => {

    const [scores, setScores] = useState(['', '', '', '']);
    const [sortConfig, setSortConfig] = useState({key: 'WPM', direction: 'ascending'}); // used to sort table based on user input
    const [load, setLoad] = useState('false'); // load is set to false until the response to our fetch request is received. 

    useEffect(() => {
        getLeaderboard();
    },[]);
    
    // MAKE A GET REQUEST TO THE SERVER FOR ALL SCORES IN THE DATABASE
    const getLeaderboard = async () => {
        try {
            //const response = await fetch("http://localhost:5000/leaderboard"); // local
            const response = await fetch("https://typetypetype-webapp.herokuapp.com/api/leaderboard"); //heroku
            const jsonData = await response.json();
            setLoad('true');
            setScores(jsonData);
        } catch (error) {
            console.log(error);    
        }
    }

    // when user clicks on a table header (e.g. Name), sortConfig stores the column that the user clicked in the key variable
    // direction variable is ascending by default. It is changed to descending if the user clicks on the same table
    // header twice in a row.
    const requestSort = (key) => { 
        let direction = 'ascending';
        if (
            sortConfig &&
            sortConfig.key === key &&
            sortConfig.direction === 'ascending'
        ) {
            direction = 'descending';
        }
        setSortConfig({ key, direction });};

    // Sort the table based on sortConfig variable
    // useEffect triggered whenever the variable SortConfig changes, which occurs when user
    // clicks on any of the table column headers
        useEffect(() => {
        let temp = scores;
            
        // Sort by: Name
        if(sortConfig.key === 'user_name') {
            temp = scores.sort(function(a, b) {
                var nameA = a.user_name.toUpperCase(); // ignore upper and lowercase
                var nameB = b.user_name.toUpperCase(); // ignore upper and lowercase
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }
                return 0;
            }).reverse();} 

        // Sort by: WPM
        else if(sortConfig.key === 'WPM') {
            temp = scores.sort(function(a, b) {
                return a.wpm - b.wpm;
            }).reverse();} 

        // Sort by: Accuracy
        else if(sortConfig.key === 'accuracy') {
            temp = scores.sort(function(a, b) {
                return a.accuracy - b.accuracy;
            }).reverse();} 

        // Sort by: ID (provides result as sorting by date)
        else if(sortConfig.key === 'id') {
            temp = scores.sort(function(a, b) {
                return a.id - b.id;
            }).reverse();}

        // reverse the table. this occurs when user clicks the same table heading (e.g. Name) twice.
        if(sortConfig.direction === 'descending') {
            temp = temp.reverse();
        }

        setScores([...temp]); // have to spread the array otherwise React won't re-render
    }, [sortConfig.key, sortConfig.direction]);

    // only load table once we have received a response from server to our GET request
    if(load == 'true') {
        return (
    <Fragment>
        <table class="table">
            <thead class="thead-dark">
                <tr>
                    <th><button class="btn btn-table" onClick={() => requestSort('user_name')}>Name</button></th>
                    <th><button class="btn btn-table" onClick={() => requestSort('WPM')}>WPM (Words Per Minute)</button></th>
                    <th><button class="btn btn-table" onClick={() => requestSort('accuracy')}>Accuracy</button></th>
                    <th><button class="btn btn-table" onClick={() => requestSort('id')}>Date</button></th>
                </tr>
            </thead>
            <tbody>
                {scores.map(score => (
                    <tr>
                        <td>{score.user_name}</td>
                        <td>{Math.round(score.wpm)}</td>
                        <td>{Math.round(score.accuracy)} %</td>
                        <td>{moment(score.posting_date).format('l')  }</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </Fragment>
    )
    } else {
        // don't load the table until load = true, which happens once the fetch request to server has completed 
        return (
            <Fragment>
            </Fragment>
        )
    }
};

export default Leaderboard;
