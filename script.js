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
    const input = document.getElementById("routeInput");
    input.blur()
    let selected = input.value;
    console.log(selected);
    let tripIdList = JSON.parse(await loadRouteTrips(selected));
    await loadIndTrip(tripIdList);
}
async function loadRouteTrips(route) {
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
async function loadIndTrip(tripIdList) {
    for(let i = 0; i < tripIdList.length; i++) {
        let tripToPrint = await tripGet(tripIdList[i]['trip_id']);
        console.log(JSON.parse(tripToPrint));
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
async function main() {
    let data = JSON.parse(await loadRoutes());
    fillRoutes(data)
}
main();