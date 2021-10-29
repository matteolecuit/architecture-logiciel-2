const amqp = require("amqplib/callback_api");

process.on("message", (message) => {
  amqp.connect("amqp://guest:guest@127.0.0.1:5672", function (err, conn) {
    conn.createChannel(async function (err, ch) {
      try {
        const ex = "transactions";
        setTimeout(() => {
          ch.consume(ex, (msg) => {
            console.log("Message received: " + msg.content);
          });
        }, 3000);
      } catch (e) {
        console.log(e);
      }
    });
  });
});
