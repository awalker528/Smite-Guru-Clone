import {md5} from "./md5.js";

let hash = md5("Hello")

//console.log(hash)   //8b1a9953c4611296a827abf8c47804d7


//fetch('https://api.coincap.io/v2/assets')
//.then(data => data.json())
//.then(data => console.log(JSON.stringify(data)))

const DEV_ID = "4491"
const AUTH_KEY = "8EC097A4ECD04E41AF57FB8F207B3F0C"
//const playerId = "599339"

let currentDate = ""

let smiteBaseUrl = "https://api.smitegame.com/smiteapi.svc"
//https://api.smitegame.com/smiteapi.svc/createsessionJson/1004/8f53249be0922c94720834771ad43f0f/20120927183145
//https://api.smitegame.com/smiteapi.svc/createsesionJson/4491/a7c1db67fe24f679846ce36f99ba9607/20230404142312

// These are the stats for each queue
let totalQueueData = 
{
    "445": {
      "Assists": 0,
      "Deaths": 0,
      "Kills": 0,
      "Losses": 0,
      "Rank": 0,
      "Wins": 0,
      "Minutes": 0,
      "Gold": 0
    },
    "450": {
      "Assists": 0,
      "Deaths": 0,
      "Kills": 0,
      "Losses": 0,
      "Rank": 0,
      "Wins": 0,
      "Minutes": 0,
      "Gold": 0
    },
    "435": {
      "Assists": 0,
      "Deaths": 0,
      "Kills": 0,
      "Losses": 0,
      "Rank": 0,
      "Wins": 0,
      "Minutes": 0,
      "Gold": 0
    },
    "448": {
      "Assists": 0,
      "Deaths": 0,
      "Kills": 0,
      "Losses": 0,
      "Rank": 0,
      "Wins": 0,
      "Minutes": 0,
      "Gold": 0
    },
    "440": {
      "Assists": 0,
      "Deaths": 0,
      "Kills": 0,
      "Losses": 0,
      "Rank": 0,
      "Wins": 0,
      "Minutes": 0,
      "Gold": 0
    },"426": {
      "Assists": 0,
      "Deaths": 0,
      "Kills": 0,
      "Losses": 0,
      "Rank": 0,
      "Wins": 0,
      "Minutes": 0,
      "Gold": 0
    },
    "451": {
      "Assists": 0,
      "Deaths": 0,
      "Kills": 0,
      "Losses": 0,
      "Rank": 0,
      "Wins": 0,
      "Minutes": 0,
      "Gold": 0
    },"459": {
      "Assists": 0,
      "Deaths": 0,
      "Kills": 0,
      "Losses": 0,
      "Rank": 0,
      "Wins": 0,
      "Minutes": 0,
      "Gold": 0
    },"Total": {
      "Assists": 0,
      "Deaths": 0,
      "Kills": 0,
      "Losses": 0,
      "Rank": 0,
      "Wins": 0,
      "Minutes": 0,
      "Gold": 0
    }
  }






async function getDate(){

    function pad2(n) { return n < 10 ? '0' + n : n }

    var date = new Date();
    let hours = 0;
    
    if(date.getHours() >= 19){
        hours = date.getHours() - 24;
    } else {
        hours = date.getHours();
    }

    //console.log(hours)

    return date.getFullYear().toString() + pad2(date.getMonth() + 1) + pad2( date.getDate() +1 ) + pad2( hours + 5 ) + pad2( date.getMinutes() ) + pad2( date.getSeconds() +1 ) ;

}

let sessionId = "not overwritten"

async function createSession(playerId){
  
    currentDate =  await getDate()
    var gamertag = playerId
    console.log("This is the timestamp " + currentDate)
    let signature = md5(DEV_ID + "createsession" + AUTH_KEY + currentDate)                              //Creates the signature for this method
 
    let url = smiteBaseUrl + "/createsessionJson/" + DEV_ID + "/" + signature + "/" + currentDate;      //Concats the URL
    console.log(url)

    let response = await fetch(url)
    const data = await response.json()
    console.log(data)     
    sesh = data.session_id
    //console.log(gamertag)
    getGodRanks(sesh, gamertag)
    getQueueStats(sesh, gamertag)
    
    
    
}



async function getGodRanks(sessionId, playerId){       ///getgodranks[ResponseFormat]/{developerId}/{signature}/{session}/{timestamp}/{playerId}
    var gamertag = playerId;
    let signature = md5(DEV_ID + "getgodranks" + AUTH_KEY + currentDate)
    let url = smiteBaseUrl + "/getgodranksJson/" + DEV_ID + "/" + signature + "/" + sessionId + "/" + currentDate + "/" + gamertag;      //Concats the URL
    console.log(url)

    let response = await fetch(url)
    const godRanks = await response.json()
    //.then(data => console.log(data))   



}

async function getQueueStats(sessionId, playerId){             //getqueuestats[ResponseFormat]/{developerId}/{signature}/{session}/{timestamp}/{playerId}/{queue}
    //console.log(sessionId)
    var gamertag = playerId
    
    let signature = md5(DEV_ID + "getqueuestats" + AUTH_KEY + currentDate)
    let queues = ["445", "450", "435", "448", "440", "426", "451", "459"];
    
    
    var totalQueueStats;
    for(let x = 0; x < queues.length; x++){         // This will iterate through all queues and assign the data to the holding variable totalQueueData
        
        let url = smiteBaseUrl + "/getqueuestatsJson/" + DEV_ID + "/" + signature + "/" + sessionId + "/" + currentDate + "/" + gamertag + '/' + queues[x];      //Concats the URL
        //console.log(url)
        let response = await fetch(url)
        const queueStats = await response.json()        
        .then(data => totalQueueStats = data)
        

        for(let i = 0; i < totalQueueStats.length; i++){                                //This assigns the data to the holding variable in JSON 
            totalQueueData[queues[x]]["Assists"] += totalQueueStats[i]["Assists"]
            totalQueueData[queues[x]]["Kills"] += totalQueueStats[i]["Kills"]
            totalQueueData[queues[x]]["Deaths"] += totalQueueStats[i]["Deaths"]
            totalQueueData[queues[x]]["Losses"] += totalQueueStats[i]["Losses"]
            totalQueueData[queues[x]]["Minutes"] += totalQueueStats[i]["Minutes"]
            totalQueueData[queues[x]]["Wins"] += totalQueueStats[i]["Wins"]
            totalQueueData[queues[x]]["Gold"] += totalQueueStats[i]["Gold"]

            totalQueueData["Total"]["Assists"] += totalQueueStats[i]["Assists"]
            totalQueueData["Total"]["Kills"] += totalQueueStats[i]["Kills"]
            totalQueueData["Total"]["Deaths"] += totalQueueStats[i]["Deaths"]
            totalQueueData["Total"]["Losses"] += totalQueueStats[i]["Losses"]
            totalQueueData["Total"]["Minutes"] += totalQueueStats[i]["Minutes"]
            totalQueueData["Total"]["Wins"] += totalQueueStats[i]["Wins"]
            totalQueueData["Total"]["Gold"] += totalQueueStats[i]["Gold"]

            
        }
        

    } 
    console.log(totalQueueData) 

};

createSession("599339")
