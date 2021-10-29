const { fork } = require("child_process");
const accounts = require("./accounts.json");
const { v4: uuidv4 } = require("uuid");
const amqp = require("amqplib/callback_api");

let delay = process.argv[2] || 100;
let agent = fork("agent");

async function start() {
  amqp.connect("amqp://guest:guest@127.0.0.1:5672", function (err, conn) {
    if (err) {
      console.log("error", err);
    } else {
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
        agent.send(JSON.stringify(transaction));
        await sendMessage(conn, JSON.stringify(transaction)).catch(console.log);
      }, delay);
    }
  });
}

start();

const sendMessage = async (conn, transaction) => {
  try {
    await conn.createChannel(async function (err, ch) {
      const ex = "transactions";
      await ch.sendToQueue(ex, Buffer.from(transaction), { persistent: true });
    });
  } catch (e) {
    console.log(e);
  }
};
