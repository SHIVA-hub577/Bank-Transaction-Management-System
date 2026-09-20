require("dotenv").config();
const app=require("./src/app");
const port=3005;

const ConnectToDb=require("./src/config/db");
ConnectToDb();

app.listen(port,()=>{
    console.log(`server started at http://localhost:${port}`);
})