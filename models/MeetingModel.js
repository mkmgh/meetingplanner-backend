'use strict'
/**
 * Module Dependencies
 */
const mongoose = require('mongoose'),
Schema = mongoose.Schema;

let meetingSchema = new Schema({
    meetingId: {
        type: String,
        default: '',
        index: true,
        unique: true
    },
    hostId:{
        type: String,
        default: " "
    },
    hostName:{
        type: String,
        default: " "
    },
    startDate:{
        type: Number,
        default: 0
    },
    endDate:{
        type: Number,
        default: 0
    },
    title:{
        type: String,
        default: "Need to Meet"
    },
    venue:{
        type: String,
        default: "Meeting Room"
    },
    purpose:{
        type: String,
        default: "Discussion of some topic"
    },
    meetingWithId:{
        type: String,
        default: " "
    },
    meetingWithName:{
        type: String,
        default: " "
    },
    meetingWithEmail:{
        type: String,
        default: " "
    },
    createdOn:{
        type: Date,
        default: new Date()
    },
    modifiedOn:{
        type: Date,
        default: new Date()
    }

});

mongoose.model('MeetingModel', meetingSchema);