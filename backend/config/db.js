const mongoose = require('mongoose');

const connectDB = async () => {
   try {
      await mongoose.connect('mongodb+srv://*******:******@cluster0.zrfyr.mongodb.net/******?retryWrites=true&w=majority&appName=Cluster0', {
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
