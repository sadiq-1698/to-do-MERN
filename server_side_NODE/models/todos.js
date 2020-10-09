const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
    item : {
        type : String,
        required : true
    }
});

const todos = mongoose.model("todos", TodoSchema);
module.exports = todos;