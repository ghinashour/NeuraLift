const mongoose = require('mongoose');


const eventSchema = new mongoose.Schema({      
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title:{
        type:String,
        required:true,
        trim:true
    },
    description:
    {
        type:String,
        required:true,
        trim:true
    },
    color:{
        type:String,
        default:"#3788d8"
    },
    startDate:
    {
        type:Date,
        required:true
    },
    endDate:
    {
        type:Date,
        required:true
    }
},{timestamps:true});
module.exports = mongoose.model('Event',eventSchema);   

