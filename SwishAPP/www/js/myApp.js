"use strict"
var games = [];
let teamMap = {};
var targetArr = [];
var obj = {};
var scores = [];
var teamScores = [];
var scoreArr = []; 
var teamList = [];
var teamAway = [];
var teamHome = [];
var awayScore = [];
var homeScore = [];
var teamName = [];
var date = [];
var i = 0;
var n = 0;
var homeWin = [];
var awayWin = [];
var homeLoss = [];
var awayLoss = [];
var tieGame = [];
//When app lunches needs to fetch data(php) & Save it to local Storage. 

if( document.deviceready){
        	document.addEventListener('deviceready', app, false);
		}else{
        	document.addEventListener('DOMContentLoaded', app, false);
		}
//Allow the app to switch between Timetable and Score

var myPages = {
  pages: [],
  links: [],
  init: function(){
    app.pages = document.querySelectorAll('[data-role="page"]');
    app.links = document.querySelectorAll('[data-role="links"]');
        
    [].forEach.call(app.links, function(item){
      item.addEventListener("click", myPages.nav);
      console.log(item.href);
    });
  },

  nav: function(ev){
    ev.preventDefault();  //stop the link from doing anything
    console.log("clicked");
    var item = ev.currentTarget;  //the anchor tag
    var href = item.href;  //the href attribute
    var id = href.split("#")[1];  //just the letter to the right of "#"

//   changes the class active to the clicked element
    [].forEach.call(app.pages, function(item){
      if( item.id == id){
        item.className = "active";
      }else{
        item.className = "";
      }
    });
  },
    
     
}

 myPages.init();

//Create a function called app to fetch PHP data
function app(){
    let url = 'https://griffis.edumedia.ca/mad9014/sports/basketball.php';
    console.log(url);
    let myData = new FormData();
    //options
    let opts = {
        method: 'post',
        mode: 'cors',
        body: myData
    }
    
    //fetch url
    fetch(url, opts).then(function (response){
        console.log("fetch succeeded");
        return response.json();
    })
    .then(function (dataJson){
        console.log(dataJson);
        scores = dataJson;
        teamList = dataJson.teams;
        teamList.forEach(function (team){
            team.win = 0;
            team.loss = 0;
            team.ties = 0;  
        });
        console.log(teamList);
        teamScores = dataJson.scores;
    console.log('data',dataJson.scores)
})
    
    .then(function (getData){
        //matched the Team Id to the Team Name
        for(i = 0; i < teamList.length; i++){
//        console.log('team id', teamList[i].id);
//        console.log('team names', teamList[i].name);
        teamName = teamList[i].name;
        var teamID = teamList[i].id;
        let idString = String(teamID);
        teamMap[teamID] = teamName;
//            standingsData();
            teamLogo();
        }
        //This loop is for the date
        for(i = 0; i < teamScores.length; i++){
         date = teamScores[i].date;
        //   This is to create a JSON Object for date
        var targetObj = {};
        targetObj.date = date;
        targetObj.data = [];
        
       //this loop is for the games and the team scores  
        for(n = 0; n < teamScores[i].games.length; n++){  
            console.log(teamScores[i].game);
            teamAway = teamMap[teamScores[i].games[n].away];
            teamHome = teamMap[teamScores[i].games[n].home];
            awayScore = teamScores[i].games[n].away_score;
            homeScore = teamScores[i].games[n].home_score;
            //push variables into Object
                obj = {};
            obj.teamAway = teamAway;
            obj.teamHome = teamHome;
            obj.awayScore = awayScore;
            obj.homeScore = homeScore;
            obj.results = "";
            targetObj.data.push(obj);
            showData();
            /////////
            let draw = (homeScore==awayScore ? 1 : 0);
            //
            teamList.forEach(function(team){
                if (team.name == teamHome ||
                    team.name == teamAway){
                    if (draw){
                        //
                        team.ties++;
                        //
                    }else{
                        if (homeScore > awayScore){
                            if (team.name == teamHome) {
                              team.win++; 
                            }
                            if (team.name == teamAway) {
                                team.loss++;
                            }
                        }else{
                            if (team.name == teamAway) {
                              team.win++; 
                            }
                            if (team.name == teamHome) {
                            team.loss++;
                            }
                        }
                    }
                }
            });
            pageRefresh();

        };
        }
       //push target object into target array
        standingsData();
        targetArr.push(targetObj); 
//        console.log(targetArr);
        setStorage(JSON.stringify(targetArr));
    })//end of then
//})
     //To catch any errors in the fetch 
    .catch(function (error) {
            console.log('Request failed', error)
            // will catch any error you need. 
        });

}

function showData(){
            //This is for the Timetable Page
        //        Create h4  
        let results = document.getElementById('results');
        let h3 = document.createElement('h3');
        h3.textContent = date;
        h3.className = 'date';
        results.appendChild(h3);
    
    //       This is for the Timetable Page
//        Create li
        let li2 = document.createElement('li');
        li2.className = 'finals';
        results.appendChild(li2);
            
//        Create p3 element
        let p3 = document.createElement('p3');
        p3.innerHTML += teamLogo(teamAway) +': '+ awayScore;
        p3.className = 'score';
        li2.appendChild(p3);
        
//        Create p4 element
        let p4 = document.createElement('p4');
        p4.innerHTML += teamLogo(teamHome) +': '+ homeScore;
        p4.className = 'score';
        li2.appendChild(p4);
    
}



function standingsData() {
    teamList = sortStandings(teamList);
  //Sample Tables stuff here:
  let tbody = document.querySelector('tbody');
teamList.forEach(function(team){
  let tr = document.createElement("tr");
  let tdn = document.createElement("td");
  tdn.innerHTML += teamLogo(team.name);
  let tdw = document.createElement("td");
  tdw.innerHTML += team.win;
  let tdl = document.createElement("td");
  tdl.innerHTML += team.loss
  let tdt = document.createElement("td");
  tdt.innerHTML += team.ties;
  tr.appendChild(tdn);
  tr.appendChild(tdw);
  tr.appendChild(tdl);
  tr.appendChild(tdt);
  tbody.appendChild(tr);
});
 
  
}


let dure0018 = localStorage.getItem("dure0018");
// JSON.stringify()



function setStorage(target){
    localStorage.setItem('dure0018', target);
}

setStorage();

function pageRefresh() {
    let reloadBtn = document.getElementById('reloadBtn');
    reloadBtn.addEventListener('click',function(ev){
        window.location.reload(true);
        storage.clear();
    });
       
}

function sortStandings(team){
  var standings = team;
    
  standings = standings.sort(function(a,b){
      return b.win - a.win;
  });
    return standings;
}

function teamLogo(teamName) {

  switch (teamName) {
                 
                 case "Chicago Bulls":
                     return '<img src="img/TeamLogo/Bulls-%2096%20px.png">';
                                     break;                 
                 case "Cleveland Cavaliers":
                     return '<img src="img/TeamLogo/Cavaliers-%2096%20px.png">';
                                     break;
                 case "Boston Celtics":
                     return '<img src="img/TeamLogo/Celtics%20-%2096px.png">';
                                     break;
                 case  'Los Angeles Clippers':
                     return '<img src="img/TeamLogo/Clippers-%2096%20px.png">';
                                     break;
                 case  'Memphis Grizzlies':
                      return '<img src="img/TeamLogo/Grizzlies-%2096%20px.png">';
                                     break;
                 case  'Toronto Raptors':
                     return '<img src="img/TeamLogo/Raptors-%2096%20px.png">';
                                     break;
                 case  'Houston Rockets':
                      return '<img src="img/TeamLogo/Rockets%20-%2096px.png">';
                                     break;
                 case  'San Antonio Spurs':
                      return '<img src="img/TeamLogo/Spurs-%2096%20px.png">';
                                     break;
                 case  'Oklahoma City Thunder':
                     return '<img src="img/TeamLogo/Thunder-96px.png">';
                                     break;  
                 case  'Golden State Warriors':
                     return '<img src="img/TeamLogo/Warriors-96px.png">';
                                     break;
                  default :
                     return 'null';
                        
                 }
    
}


       