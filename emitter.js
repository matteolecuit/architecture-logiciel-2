const { fork } = require('child_process');
const {
    v4: uuidv4,
} = require('uuid');
let delay = process.argv[2] || 100
let agent = fork('agent');
async function start(){
    setInterval(async () => {
        let isCorrupted = Math.random() < 0.1;
        let transaction = {
            timestamp : Date.now(),
            transactionId : uuidv4(),
            amount : isCorrupted ? -1 : Math.floor(Math.random() * (10000 +2 +1)) -2
        }
        console.log("Transaction "+transaction.transactionId+" ("+transaction.amount+"€) envoyée");

        // Appel de l'agent pour le traitement de la transaction
        agent.send(JSON.stringify(transaction))
    } , delay)
}

start();
