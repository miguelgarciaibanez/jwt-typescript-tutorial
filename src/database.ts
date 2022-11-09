import mongoose from "mongoose";
import config from './config/config';

(async () => {
    try {
        mongoose.connect(config.DB.URI,
            {},
            () => {
              console.log('Connected to MongoDB');
            })
    } catch (error) {
        console.log("Database connection error", error);
    }

})();

const connection = mongoose.connection;

connection.once('open', () =>{
    console.log('Mongodb connection stablished');
});

connection.on('error', err =>{
    console.log(err);
    process.exit(0);
})


export default connection;