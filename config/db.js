const mongoose = require('mongoose');

const conn = async ()=>{
 try {
     const connection = await mongoose.connect(process.env.MONGO_URI,{
                  useNewUrlParser:true,
                  useFindAndModify:false,
                  useUnifiedTopology:true,
     })
     console.log(`Mongo db Connected: ${process.env.MONGO_URI}`);
 } catch (error) {
     console.log(error)
     process.exit(1)
 }
}
module.exports= conn;