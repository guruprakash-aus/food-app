import expressApp from './expressApp'

const PORT = process.env.PORT || 8081;

export const StartServer = async() => {

    expressApp.listen(PORT, () => {
        console.log(`Order Service App is listening to: ${PORT}`);
    });

    process.on("uncaughtException", async (err) => {
        console.log(err);
        process.exit(1);
    })
}

StartServer().then(() => {
    console.log("Order Service Server is up");
})