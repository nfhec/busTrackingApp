import ('node-fetch');

const serverUrl = 'http://localhost:3000';

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