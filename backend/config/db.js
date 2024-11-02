const mongoose = require('mongoose');

const connectDB = async () => {
   try {
      await mongoose.connect('mongodb+srv://regmirasad53:mnrrh.@cluster0.zrfyr.mongodb.net/scamdb?retryWrites=true&w=majority&appName=Cluster0', {
         useNewUrlParser: true,
         useUnifiedTopology: true,
      });
      console.log('MongoDB connected');
   } catch (error) {
      console.error('MongoDB connection error:', error);
      process.exit(1);
   }
};

module.exports = connectDB;
