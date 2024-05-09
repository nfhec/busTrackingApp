import http from 'http';
import cors from 'cors';
const port = 7000;

let clientIdCounter = 0;



const corsOptions = {
    origin: '*',
    methods: 'POST', //only allow post reqs
    optionsSuccessStatus: 204
};

const server = http.createServer((req, res) => {
    cors(corsOptions)(req,res,() => {
        if (req.method === 'OPTIONS') {
            //preflight
            res.end();
        } else if (req.url === '/api/data' && req.method === 'POST') {
            let body =[];
            req.on('data', chunk => {
                body += chunk;
            });
            //process received data
            req.on('end', () => {
                body = JSON.parse(body);
                console.log('body: '+ body['request']);
                let request = body['request'];
                if (request === 'makeId') {
                    const clientId = ++clientIdCounter;
                    res.setHeader('Content-Type', 'application/json');
                    res.statusCode = 200;
                    res.end(JSON.stringify({'clientId': clientId}));
                }
            });

        } else {
            res.statusCode = 404;
            res.end('Request not found');
        }
    })
})

server.on('error',(err) => {
    console.error('Server error: ', err.message);
});
server.listen(port, () =>{
    console.log(`Server listening on port: ${port}`);
})



/*
let routes;
$.ajax({
    url: 'route_fetch.php',
    type: 'POST',
    success: function (data) {
        routes = JSON.parse(data);
    }
});

 */

