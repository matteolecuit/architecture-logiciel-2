const amqp = require("amqplib/callback_api");

process.on("message", () => {
  amqp.connect("amqp://guest:guest@127.0.0.1:5672", function (err, conn) {
    conn.createChannel(async function (err, ch) {
      try {
        const ex = "notifications_mail";
        setTimeout(() => {
          ch.consume(ex, (msg) => {
            const message = msg.content.toString();
            console.log(
              "[SMS] SMS envoyé au 06 52 52 52 52 avec succès (%s)",
              message
            );
          });
        }, 3000);
      } catch (e) {
        console.log(e);
      }
    });
  });
});
