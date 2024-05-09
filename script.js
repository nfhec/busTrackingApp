import ('node-fetch');

const serverUrl = 'http://192.168.1.8:7000/api/data';
const postData = {};
let clientId;
async function main() {
    try {
        clientId = JSON.parse(await makeId());
        console.log(clientId);
    } catch (err) {
        console.error(err.message);
    }

}

function request() {
    return fetch(serverUrl, {
        method: 'POST',
        headers: {
            'Connection': 'keep-alive',
            'Content-type' : 'application/json'
        },
        body: JSON.stringify(postData)
    })
        .then(response =>{
            if(response.ok) {
                return response.text();
            } else {
                throw new Error(`Error: ${response.status} - ${response.statusText}`)
            }
        });
}

async function makeId() {
    postData['request'] = 'makeId';
    try {
        const data = await request(postData);
        return data;
    } catch (error) {
        console.error((error.message));
        throw error;
    }
}

async function loadRouteList() {
    postData.keyOne['request'] = 'routeList';
    try {
        let routes = await request(postData);
    } catch (e) {
        console.error(e.message);
        throw e;
    }
    for (let i = 1; i < routes.length; i++) {
        const list = document.getElementById('routeDatalist');
        const option = document.createElement('option');
        option.setAttribute('id', 'routeDatalistOption');
        option.innerHTML = routes[i]['route_desc'];
        option.innerText = routes[i]['route_short_name'];
        list.append(option);
    }
}
function routeSelected() {
    const routeInp = document.getElementById('routeInput');
    console.log(routeInp.value);
    loadRoute(routeInp.value);
}
function loadRoute(route) {
    $.ajax({
        url: 'load_route.php',
        type: 'POST',
        data: {
            route: route,
        },
        success: function(data) {
            console.log(data);
            console.log((JSON.parse(data)));
        }
    })
}
main();