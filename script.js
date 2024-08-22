/*

import ('node-fetch');

const serverUrl = 'http://localhost:3306';

 async function request() {
     const startTime = performance.now();
     console.log(serverUrl.concat('/initial'));
     return await fetch(serverUrl.concat('/initial'))
         .then(response => response.status)
         .then(data => {
             const endTime = performance.now();
             console.log(`Server responded with: ${data} in ${(endTime - startTime).toFixed(2)} ms`);
             return data;
         })
         .catch(error => console.error(error));
 }
async function main() {
    if (await request() === 200) {
        console.log('Connected');
    }
}
main();

 */

async function loadRoutes() {
    let routeArray = [];
    return $.ajax({
        url: 'route_fetch.php',
        type: 'POST',
        success: function(data) {
            routeArray = (data);
            return routeArray;
        }
    })
}
function fillRoutes(routeArray) {
    console.log("Length: " + routeArray.length);
    const routeList = document.getElementById("routeDatalist");
    for (let i = 1; i < routeArray.length; i++) {
        const option = document.createElement('option');
        option.setAttribute('id', 'routeDatalistOption');
        option.innerHTML = routeArray[i]['route_desc'];
        option.innerText = routeArray[i]['route_short_name'];
        routeList.append(option);
    }
}
async function routeSelected() {
    //allow user to select their stop
    document.getElementById("stopList").hidden = false;

    //capture route number
    const input = document.getElementById("routeInput");
    input.blur()
    let selected = input.value;
    console.log(selected);
    let tripIdList = JSON.parse(await loadRouteTrips(selected));
    await loadIndTrip(tripIdList);
    console.log(tripList);

    fillStops();
}
async function loadRouteTrips(route) { //load the trips along selected route for current date
    return $.ajax({
        url: "load_route.php",
        type: "POST",
        data : {
            route: route
        },
        success: function(data) {
            return (data);
        }
    })
}
let tripList = {};
async function loadIndTrip(tripIdList) { //load the trips stop times and stops

    for(let i = 0; i < tripIdList.length; i++) {
        let tripToPrint;
        try {
            //returns trip stops for the trip id stored in tripIdList
            tripToPrint = JSON.parse(await tripGet(tripIdList[i]['trip_id']));
           // console.log(tripToPrint);
            tripList[i] = {"trip_id": tripToPrint['trip_id'], 'stops':tripToPrint["stops"]}   ;
            //tripList[tripToPrint['trip_id']] = { "stops" : tripToPrint["stops"]}
        } catch(e) {
            console.log("Error: " + e.data);
        }

    }
}
async function tripGet(tripId) {
    console.log("Getting trip: " + tripId);
    return $.ajax({
        url: "load_route_stops.php",
        type: "POST",
        data: {
            trip_id: tripId
        },
        success: function (data) {
            return data;
        }
    })

}
function fillStops() {
    let longest = 0;
    let toPull;
    let k = 0;
    let i =0;
    while(tripList[i + 1] !== undefined) {
        k=0;
        while(tripList[i]['stops'][k+1] !== undefined) {
            if(k > longest)  {
                longest = k;
                toPull = tripList[i]['trip_id'];
            }
            k++;
    }
    i++;
}
    const stopList = document.getElementById("stopDataList");
    for(let j = 1; j <= longest; j++) {
        try {
            const option = document.createElement('option');
            option.setAttribute('id', 'stopDatalistOption');

            option.innerText = tripList[i]['stops'][j]['stop_name'];
            stopList.append(option);
        }catch (e) {
            console.log("Error on stop fill: " + e.message);
        }
    }

}
async function stopSelected() {
     const input = document.getElementById("stopInput");
     input.blur();
     let selected = input.value;
     console.log(selected);
     let stopId = await getStopId(selected);
     console.log(stopId);
     let i = 0;

     while(tripList[i + 1] !== undefined) {
         $.ajax({
             url: 'tripStopTimes.php' ,
             type: 'POST',
             data: {
                   tripId: tripList[i]['trip_id'],
                   stopId: stopId
             },
             success: function(data) {
                console.log("Arrival Time: " + data);
             }
         });
         i++;
     }
}
async function getStopId(selected) {
    console.log("query: " + selected);
    return $.ajax({
        url: 'getStopId.php',
        type: 'POST',
        data: {
            stopName: selected
        },
        success: function(data) {
            return ( data);

        }
    });
}
async function main() {
    let data = JSON.parse(await loadRoutes());
     fillRoutes(data)

}
main();