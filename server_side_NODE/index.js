const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const todosModel = require("./models/todos");

app.use(express.json());
app.use(cors());

mongoose.connect(
    "mongodb+srv://sadiq-1698:Iamtheboss1698@todo.rodyv.mongodb.net/todo?retryWrites=true&w=majority", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    }
);


app.post("/insert", async (req, res) => {
    const item = req.body.item;
    const todo = new todosModel({
        item: item
    });

    try {
        const result = await todo.save();
        res.send(result);
    } catch (err) {
        console.log(err);
    }
});

app.get("/read", async (req, res) => {

    try {
        await todosModel.find({}, (error, result) => {
            if (error) return res.send(error);
            return res.send(result);
        });
    } catch (error) {
        console.log(error);
    }
});

app.put("/update", async (req, res) => {
    const item = req.body.item;
    const id = req.body.id;

    try {
        await todosModel.findById(id, (err, updatedItem) => {
            updatedItem.item = item;
            updatedItem.save();
            res.send("Item updated");
        });
    } catch (error) {
        console.log(error);
    }

});

app.delete('/delete/:id', async (req, res) => {

    const id = req.params.id;
    try {
        await todosModel.findByIdAndRemove(id).exec();
        res.send("Item deleted");
    } catch (error) {
        console.log(error);
    }

});

app.listen(3001, () => {
    console.log("Listening on port 3001...");
});