
process.on("message" , (message) => {
    let transaction = JSON.parse(message);
    setTimeout(() => {
        console.log(`Transaction n° ${transaction.transactionId} traitée avec succès`)
    } , 3000)
})
