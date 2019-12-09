class Competitor {
    name;
    rank;
    ASRunweighted;
    ASRweighted;
    gameWins;
    gameLosses;
    gameWinPct;
    gameWinPctWeighted;
    gameWinValueAvg;
    gameWinValueTotal;
    gameLossValueAvg;
    gameLossValueTotal;
    matchWins;
    matchLosses;
    matchWinPct;
    matchWinPctWeighted;
    matchWinValueAvg;
    matchWinValueTotal;
    matchLossValueAvg;
    matchLossValueTotal;
    //tournaments;
    constructor(name) {
        this.name = name;
        this.gameWins = 0;
        this.gameLosses = 0;
        this.gameWinValueTotal = 0;
        this.gameLossValueTotal = 0;
        this.matchWins = 0;
        this.matchLosses = 0;
        this.matchWinValueTotal = 0;
        this.matchLossValueTotal = 0;
    }

    addGameWins(wins) {
        var wins = parseInt(wins);
        this.gameWins += wins;
    }
    addGameLosses(losses) {
        var losses = parseInt(losses);
        this.gameLosses += losses;
    }
    addMatchWins(wins) {
        var wins = parseInt(wins);
        this.matchWins += wins;
    }
    addMatchLosses(losses) {
        var losses = parseInt(losses);
        this.matchLosses += losses;
    }
    calcWinloss() {
        var percent = this.gameWins / (this.gameWins + this.gameLosses);
        this.gameWinPct = percent;
        var percent = this.matchWins / (this.matchWins + this.matchLosses);
        this.matchWinPct = percent;
    }
    calcASRunweighted() {
        this.ASRunweighted = 500;
        var matchmultiplier = 5;
        var gamemultiplier = 3;
        var overallmultiplier = 50;
        // var modifiedmatchpct = ((this.matchWinPct**(1/2)+this.matchWinPct**4)/2) ;
        // var modifiedgamepct = ((this.gameWinPct**(1/2)+this.gameWinPct**4)/2) ;
        var modifiedmatchpct = Math.atan(Math.PI * this.matchWinPct + 0.2 - (Math.PI / 2));
        var modifiedgamepct = Math.atan(Math.PI * this.gameWinPct + 0.2 - (Math.PI / 2));


        var matchmodifier = (overallmultiplier * modifiedmatchpct * matchmultiplier);
        var gamemodifier = (overallmultiplier * modifiedgamepct * gamemultiplier);
        this.ASRunweighted += matchmodifier + gamemodifier;
    }
    calcWeightedASR() {
        this.ASRweighted = 500;
        var matchmultiplier = 5;
        var gamemultiplier = 3;
        var overallmultiplier = 50;
        // var weightedMatchWinPct = (this.matchWinPct * this.matchWinValueAvg) - ((1-this.matchWinPct) * this.matchLossValueAvg);
        var wWins = (this.matchWins * this.matchWinValueAvg);
        var wLosses = (this.matchLosses * this.matchLossValueAvg);
        this.matchWinPctWeighted = wWins / (wWins + wLosses);

        var wWins = (this.gameWins * this.gameWinValueAvg);
        var wLosses = (this.gameLosses * this.gameLossValueAvg);
        this.gameWinPctWeighted = wWins / (wWins + wLosses);


        var modifiedmatchpct = Math.atan(Math.PI * this.matchWinPctWeighted + 0.2 - (Math.PI / 2));
        var modifiedgamepct = Math.atan(Math.PI * this.gameWinPctWeighted + 0.2 - (Math.PI / 2));


        var matchmodifier = (overallmultiplier * modifiedmatchpct * matchmultiplier);
        var gamemodifier = (overallmultiplier * modifiedgamepct * gamemultiplier);
        this.ASRweighted += matchmodifier + gamemodifier;
    }
}

class Person {
    id;
    name;
    wins = 0;
    losses = 0;
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}

class Tournament {
    matches = [];
}

class Match {
    player1;
    player2;
    name1;
    name2;
    player1Wins;
    player2Wins;
    winner;
    constructor(player1, player2, name1, name2, player1Wins, player2Wins, winner) {
        this.player1 = player1;
        this.player2 = player2;
        this.name1 = name1;
        this.name2 = name2;
        this.player1Wins = player1Wins;
        this.player2Wins = player2Wins;
        this.winner = winner;
    }
}



var t1id = "984a0yjy";
var t2id = "9hxarvtz";
var t3id = "l0asqvvj";
var t4id = "9qdh8yf3";

// https://api.challonge.com/v1/tournaments/{tournament}/participants.{json|xml}
// https://api.challonge.com/v1/tournaments/l0asqvvj/participants.json





var tournament1info = { people: tournament1participants, matches: tournament1 };
var tournament2info = { people: tournament2participants, matches: tournament2 };
var tournament3info = { people: tournament3participants, matches: tournament3 };
var tournament4info = { people: tournament4participants, matches: tournament4 };
var tournament1data = getTournamentResults(tournament1info);
var tournament2data = getTournamentResults(tournament2info);
var tournament3data = getTournamentResults(tournament3info);
var tournament4data = getTournamentResults(tournament4info);
var alltournaments = tournament1data.concat(tournament2data);
var alltournaments = alltournaments.concat(tournament3data);
var alltournaments = alltournaments.concat(tournament4data);

console.log("Here's tournament data: ");
console.log(alltournaments);

var competitordata = [];
assignResultsToPeople(alltournaments);
calcASRunweighted();
calcASRweighted(alltournaments);
calcRank("ASRweighted");
createTableForCompetitors();

console.log(competitordata);


function getTournamentResults(tournament) {
    var tpeople = tournament.people;
    var tresult = tournament.matches;

    var playerlist = getPlayerList(tpeople);
    // console.log("Here's the playerlist: ");
    // console.log(playerlist);

    var resultlist = getMatchResults(tresult);
    // console.log("Here's the resullist: ");
    // console.log(resultlist);

    return resultlist;

    function getPlayerList(tpeople) {
        var tpeoplearray = [];

        for (i = 0; i < tpeople.length; i++) {
            var pid = tpeople[i].participant.id;
            var pname = tpeople[i].participant.name;
            var testperson = new Person(pid, pname);
            tpeoplearray.push(testperson);
        }
        return (tpeoplearray);
    }

    function getMatchResults(tresult) {
        var tresultarray = [];

        for (i = 0; i < tresult.length; i++) {
            var p1 = tresult[i].match.player1_id;
            var p2 = tresult[i].match.player2_id;
            var scores = tresult[i].match.scores_csv;
            var p1w = scores.charAt(0);
            var p2w = scores.charAt(2);
            var n1 = getNameFromId(p1);
            var n2 = getNameFromId(p2);
            var winnerid = tresult[i].match.winner_id;
            var winnername = getNameFromId(winnerid);
            var testmatch = new Match(p1, p2, n1, n2, p1w, p2w, winnername)
            tresultarray.push(testmatch);
        }
        return (tresultarray);
    }

    function getNameFromId(id) {
        for (j = 0; j < playerlist.length; j++) {
            if (playerlist[j].id == id) {
                return playerlist[j].name;
            }
        }
        console.log("Something went wrong!");
        return;
    }
}

function assignResultsToPeople(matchdata) {

    createCompetitorList(matchdata);
    for (i = 0; i < matchdata.length; i++) {
        for (j = 0; j < competitordata.length; j++) {
            if (competitordata[j].name == matchdata[i].name1) {
                var wins = matchdata[i].player1Wins;
                var losses = matchdata[i].player2Wins;
                competitordata[j].addGameWins(wins);
                competitordata[j].addGameLosses(losses);
                if (competitordata[j].name == matchdata[i].winner) {
                    competitordata[j].addMatchWins(1);
                }
                else {
                    competitordata[j].addMatchLosses(1);
                }
            }
            if (competitordata[j].name == matchdata[i].name2) {
                var wins = matchdata[i].player2Wins;
                var losses = matchdata[i].player1Wins;
                competitordata[j].addGameWins(wins);
                competitordata[j].addGameLosses(losses);
                if (competitordata[j].name == matchdata[i].winner) {
                    competitordata[j].addMatchWins(1);
                }
                else {
                    competitordata[j].addMatchLosses(1);
                }
            }
        }
    }
    for (j = 0; j < competitordata.length; j++) {
        competitordata[j].calcWinloss();
    }

    function createCompetitorList(matchdata) {
        for (j = 0; j < matchdata.length; j++) {
            var name = matchdata[j].name1;
            if (!competitorExists(name)) {
                competitordata.push(new Competitor(name));
            }
            var name = matchdata[j].name2;
            if (!competitorExists(name)) {
                competitordata.push(new Competitor(name));
            }
        }
    }

    function competitorExists(name) {
        for (i = 0; i < competitordata.length; i++) {
            if (name == competitordata[i].name) {
                return true;
            }
        }
        return false;
    }
}

function calcASRunweighted() {
    for (i = 0; i < competitordata.length; i++) {
        competitordata[i].calcASRunweighted();
    }
}

function calcASRweighted(matchdata) {
    console.log(matchdata);
    for (i = 0; i < competitordata.length; i++) {
        // competitordata[i].ASRweighted = competitordata[i].ASRunweighted;
        // competitordata[i].ASRweighted = 500;
    }

    for (i = 0; i < matchdata.length; i++) {
        for (j = 0; j < competitordata.length; j++) {
            if (competitordata[j].name == matchdata[i].name1) {
                calcWeight(competitordata[j], matchdata[i].name2, matchdata[i].winner, matchdata[i].player1Wins, matchdata[i].player2Wins);
            }
            else if (competitordata[j].name == matchdata[i].name2) {
                calcWeight(competitordata[j], matchdata[i].name1, matchdata[i].winner, matchdata[i].player2Wins, matchdata[i].player1Wins);
            }
        }
    }
    for (i = 0; i < competitordata.length; i++) {
        if (competitordata[i].matchWins == 0) {
            competitordata[i].matchWinValueAvg = 0
        }
        else {
            competitordata[i].matchWinValueAvg = (competitordata[i].matchWinValueTotal / competitordata[i].matchWins);
        }
        if (competitordata[i].matchLosses == 0) {
            competitordata[i].matchLossValueAvg = 0
        }
        else {
            competitordata[i].matchLossValueAvg = (competitordata[i].matchLossValueTotal / competitordata[i].matchLosses);
        }

        if (competitordata[i].gameWins == 0) {
            competitordata[i].gameWinValueAvg = 0
        }
        else {
            competitordata[i].gameWinValueAvg = (competitordata[i].gameWinValueTotal / competitordata[i].gameWins);
        }

        if (competitordata[i].gameLosses == 0) {
            competitordata[i].gameLossValueAvg = 0
        }
        else {
            competitordata[i].gameLossValueAvg = (competitordata[i].gameLossValueTotal / competitordata[i].gameLosses);
        }
    }
    for (i = 0; i < competitordata.length; i++) {
        competitordata[i].calcWeightedASR();
    }

    function getASRunweighted(name) {
        for (k = 0; k < competitordata.length; k++) {
            if (competitordata[k].name == name) {
                return competitordata[k].ASRunweighted;
            }
        }
    }

    function calcWeight(competitor, opp, matchwinner, wins, losses) {
        var ASRunweighteddifference = competitor.ASRunweighted - getASRunweighted(opp);
        var ASRunweighteddifference = 500 - getASRunweighted(opp);
        var winweight = calcWeightModifier(ASRunweighteddifference, -1);
        var lossweight = calcWeightModifier(ASRunweighteddifference, 1);
        // var winweight = -0.7 * Math.atan(ASRunweighteddifference / 400) + 1;
        // var lossweight = 0.7 * Math.atan(ASRunweighteddifference / 400) + 1;
        if (competitor.name == matchwinner) {
            competitor.matchWinValueTotal += winweight;
        }
        else {
            competitor.matchLossValueTotal += lossweight;
        }
        competitor.gameWinValueTotal += (winweight * wins);
        competitor.gameLossValueTotal += (lossweight * losses);

        function calcWeightModifier(x, coeff) {
            return (coeff * 1 * Math.atan(x / 400) + 1);
        }
    }
}

function calcRank(comparepoint) {
    for (i = 0; i < competitordata.length; i++) {
        for (j = 0; j < competitordata.length; j++) {
            if (competitordata[i][comparepoint] > competitordata[j][comparepoint]) {
                var holder = competitordata[i];
                competitordata[i] = competitordata[j];
                competitordata[j] = holder;
            }
        }
    }
    for (i = 0; i < competitordata.length; i++) {
        competitordata[i].rank = i + 1;
    }


}

function createTableForCompetitors() {
    var node = document.getElementById("smashdatadiv");
    var div = document.createElement('div');
    var table = document.createElement('table');
    table.className = 'container';
    var thead = document.createElement('thead');
    var tr = document.createElement('tr');
    for (j = 0; j < Object.keys(competitordata[0]).length; j++) {
        var th = document.createElement('th');
        var h1 = document.createElement('h1');
        h1.innerHTML = getThNames(Object.keys(competitordata[0])[j]);
        if (isBonusData(Object.keys(competitordata[0])[j])) {
            th.className = "hide";
        }
        th.append(h1);
        tr.append(th);
    }
    thead.append(tr);
    var tbody = document.createElement('tbody');
    for (i = 0; i < competitordata.length; i++) {
        var tr = document.createElement('tr');
        for (j = 0; j < Object.keys(competitordata[0]).length; j++) {
            var td = document.createElement('td');
            var data = competitordata[i][Object.keys(competitordata[i])[j]];
            if (typeof data == 'number') {
                if (Object.keys(competitordata[0])[j] == "matchWinPct" || Object.keys(competitordata[0])[j] == "gameWinPct") {
                    data = (data * 100).toFixed() + "%";
                }
                else if (isBonusData(Object.keys(competitordata[0])[j])) {
                    data = data.toFixed(2);
                }
                else {
                    data = data.toFixed();
                }
            }
            if (isBonusData(Object.keys(competitordata[0])[j])) {
                td.className = "hide";
            }
            td.innerHTML = data;
            tr.append(td);
        }
        tbody.append(tr);
    }
    table.append(thead, tbody);
    div.append(table);
    node.innerHTML = "";
    node.append(div);

    function getThNames(label) {
        const highlightData = ["name", "rank", "ASRweighted", "gameWins", "gameLosses", "gameWinPct", "matchWins", "matchLosses", "matchWinPct", ]
        const niceNames = ["Name", "Rank", "Rating", "Game Wins", "Game Losses", "Game Win %", "Match Wins", "Match Losses", "Match Win %", ]
        for (k = 0; k < highlightData.length; k++) {
            if (label == highlightData[k]) {
                return niceNames[k];
            }
        }
        return label;
    }

    function isBonusData(label) {
        const highlightData = ["name", "rank", "ASRweighted", "gameWins", "gameLosses", "gameWinPct", "matchWins", "matchLosses", "matchWinPct", ]
        for (k = 0; k < highlightData.length; k++) {
            if (label == highlightData[k]) {
                return false;
            }
        }
        return true;
    }
}

function showAllData() {
    var elements = document.querySelectorAll('.hide');
    if (elements.length > 1) {
        document.getElementById('dataamountbutton').value = "Show Less Data";
        for (i = 0; i < elements.length; i++) {
            elements[i].className = "show";
        }
    }
    else {
        var elements = document.querySelectorAll('.show')
        document.getElementById('dataamountbutton').value = "Show All Data";
        for (i = 0; i < elements.length; i++) {
            elements[i].className = "hide";
        }
    }
}













































// let proxyUrl = 'https://cors-anywhere.herokuapp.com/';
// let targetUrl = "https://IdemCollector:PT3UGX1KDLF52EDvSON5oVlb1egd3pm4IVyyjAXv@api.challonge.com/v1/tournaments/l0asqvvj/matches.json";
// let otherURL = "https://api.challonge.com/v1/tournaments/984a0yjy/matches.json"
// fetch(targetUrl).then(function (response) {
//     return response.json();
// }).then(function (json) {
//     console.log(json);
//     matches = json;
// })
// function plswork(){
//         var myInit = { 
//             method: 'GET',
//             headers: myHeaders,
//             mode: 'cors',
//             cache: 'default' 
//         };

//         var myRequest = new Request()
//     }

//     request = new Request(otherURL, {method: 'GET', mode: 'cors',Authorization: 'IdemCollector',api_key:'PT3UGX1KDLF52EDvSON5oVlb1egd3pm4IVyyjAXv'});

//     fetch(request)
//         .then(function (response) {
//             return response.json();
//         }).then(function (json) {
//             console.log(json);
//             matches = json;
//         })


// function loadDoc(){
//     var xhttp = new XMLHttpRequest();
//     xhttp.onreadystatechange = function() {
//         if (this.readyState == 4 && this.status == 200) {
//         console.log(this.responseText);
//         }
//     };
//     xhttp.open("GET", proxyUrl+targetUrl, true);
//     xhttp.send();
// }



//     $(document).ready(function(){
//     $.get(targetUrl, function(data, status){
//         console.log('${data}')
//     });
// });



// api key: PT3UGX1KDLF52EDvSON5oVlb1egd3pm4IVyyjAXv

// https://IdemCollector:PT3UGX1KDLF52EDvSON5oVlb1egd3pm4IVyyjAXv@api.challonge.com/v1/tournaments/984a0yjy/matches.json
