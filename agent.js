
process.on("message" , (message) => {
    let transaction = JSON.parse(message);
    setTimeout(() => {
        console.log(`[AGENT] Transaction n° ${transaction.transactionId} traitée avec succès`)
    } , 3000)
})
