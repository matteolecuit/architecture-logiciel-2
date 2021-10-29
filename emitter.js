const { fork } = require("child_process");
const accounts = require("./accounts.json");
const { v4: uuidv4 } = require("uuid");
const amqp = require("amqplib/callback_api");

let delay = process.argv[2] || 100;
let agent = fork("agent");
async function start() {
  setInterval(async () => {
    let isCorrupted = Math.random() < 0.1;
    let accountIndex = Math.floor(Math.random() * 99);
    let transaction = {
      account_num: accounts[accountIndex].account_id,
      timestamp: Date.now(),
      transactionId: uuidv4(),
      amount: isCorrupted
        ? -1
        : Math.floor(Math.random() * (10000 + 2 + 1)) - 2,
    };
    console.log(
      `[EMITTER] Transaction n°${transaction.transactionId} (${transaction.amount}€) envoyée`
    );

    // Appel de l'agent pour le traitement de la transaction
    agent.send(JSON.stringify(transaction));
    sendMessage(JSON.stringify(transaction));
  }, delay);
}

start();

const sendMessage = (transaction) => {
  amqp.connect("amqp://guest:guest@127.0.0.1:5672", function (err, conn) {
    if (err) {
      console.log("error", err);
    } else {
      conn.createChannel(function (err, ch) {
        const ex = "transactions";
        for (let postIndex = 1; postIndex < 15; postIndex++) {
          ch.assertExchange(ex, "fanout", { durable: false });
          ch.publish(ex, "", new Buffer(transaction));
          console.log(" [x] Sent %s", transaction);
        }
      });
    }
  });
};
