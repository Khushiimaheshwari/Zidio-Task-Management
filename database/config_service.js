import mongoose from "mongoose";

const features_Schema = new mongoose.Schema({
    Title: {type: String, required: true},
    Description: {type: String},
    Date: {type: String},
    Time: {type: String},
    AssignedTo: {type: String, required: true},
    Deadline: {type: String, required: true},
    Priority: {type: String},
})

const Features = mongoose.model("Features", features_Schema);

export class Service {

}

const service = new Service;
export default service;