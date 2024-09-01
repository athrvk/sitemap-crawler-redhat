const exec = require('child_process').exec;

exec('cd client && npm install', (error, stdout, stderr) => {
    console.log('Installing dependencies for server and client...');
    console.log('-------------------------');
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`client: ${stdout}`);
    exec('cd server && npm install', (error, stdout, stderr) => {
        console.log('-------------------------');
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`server: ${stdout}`);
        exec('cd client && npm run build', (error, stdout, stderr) => {
            console.log('Building client...');
            console.log('-------------------------');
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            console.log(`client: ${stdout}`);
        })


    })
})