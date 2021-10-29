const amqp = require("amqplib/callback_api");
const { fork } = require("child_process");

const mailAgent = fork("agent_mail_notifier");
const smsAgent = fork("agent_sms_notifier");

process.on("message", (message) => {
  amqp.connect("amqp://guest:guest@127.0.0.1:5672", function (err, conn) {
    conn.createChannel(async function (err, ch) {
      try {
        const ex = "transactions";
        setTimeout(() => {
          ch.consume(ex, (msg) => {
            const transaction = JSON.parse(msg.content.toString());
            const isValid = transaction.amount !== -1;
            if (isValid)
              acceptTransaction(conn, msg.content).catch(console.log);
            else rejectTransaction(conn, msg.content).catch(console.log);
          });
        }, 3000);
      } catch (e) {
        console.log(e);
      }
    });
  });
});

const acceptTransaction = async (conn, transaction) => {
  try {
    await conn.createChannel(async function (err, ch) {
      const ex = "accepted";
      await ch.sendToQueue(ex, Buffer.from(transaction), { persistent: true });
      console.log(" [x] Transaction accepted %s", transaction);
      mailAgent.send(JSON.stringify(transaction));
      smsAgent.send(JSON.stringify(transaction));
    });
  } catch (e) {
    console.log(e);
  }
};

const rejectTransaction = async (conn, transaction) => {
  try {
    await conn.createChannel(async function (err, ch) {
      const ex = "rejected";
      await ch.sendToQueue(ex, Buffer.from(transaction), { persistent: true });
      console.log(" [x] Transaction rejected %s", transaction);
    });
  } catch (e) {
    console.log(e);
  }
};
