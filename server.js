const express = require("express");
const app = express();
const Joi = require("joi");
const multer = require("multer");
app.use(express.static("public"));
app.use(express.json());
const cors = require("cors");
app.use(cors());

const mongoose = require("mongoose");

const upload = multer({ dest: __dirname + "/public/images" });

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

const carSchema = new mongoose.Schema({
    name: String,
    description: String,
    trims: [String],
  });
  
  const Car = mongoose.model("Car", carSchema);

app.get("/api/cars", (req,res) => {
    getCars(res);
});

const getCars = async (res) => {
    const cars = await Car.find();
    res.send(cars);
};

app.post("/api/cars", (req, res) => {
    const result = validateCar(req.body);
  
    if (result.error) {
      res.status(400).send(result.error.details[0].message);
      return;
    }
  
    const car = new Car({
      name: req.body.name,
      description: req.body.description,
      trims: req.body.ingredients.split(","),
    });

    createCar(car, res);
  });

  const createCar = async (car, res) => {
    const result = await car.save();
    res.send(car);
  };

  app.put("/api/cars/:id", upload.single("img"), (req, res) => {
    const result = validateCar(req.body);
  
    if (result.error) {
      res.status(400).send(result.error.details[0].message);
      return;
    }
  
    updateCar(req, res);
  });
  
  const updateCar = async (req, res) => {
    let fieldsToUpdate = {
      name: req.body.name,
      description: req.body.description,
      trims: req.body.ingredients.split(","),
    };
  
    const result = await Car.updateOne({ _id: req.params.id }, fieldsToUpdate);
    const car = await Car.findById(req.params.id);
    res.send(car);
  };
  
  app.delete("/api/cars/:id", (req, res) => {
    removeCar(res, req.params.id);
  });
  
  const removeCar = async (res, id) => {
    const car = await Recipe.findByIdAndDelete(id);
    res.send(car);
  };

  const validateCar = (car) => {
    const schema = Joi.object({
      _id: Joi.allow(""),
      ingredients: Joi.allow(""),
      name: Joi.string().min(3).required(),
      trims: Joi.string().min(3).required(),
    });
    return schema.validate(recipe);
};


app.listen(3000, () => {
    console.log("I'm listening");
});