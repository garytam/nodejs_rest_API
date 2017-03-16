import mongoose from 'mongoose';
import { Router } from 'express';
import FoodTruck from '../model/foodtruck';
import Review from '../model/review';


export default ({config, db}) => {
  let api = Router();

  // '/v1/foodtruck/add'
  api.post('/add', (req, res) => {
    let newFoodTruck = new FoodTruck();
    newFoodTruck.name = req.body.name;
    newFoodTruck.foodtype = req.body.foodtype;
    newFoodTruck.avgcost = req.body.avgcost;
    newFoodTruck.geometry.coordinates = req.body.geometry.coordinates;

    newFoodTruck.save(err => {
      if (err){
        res.send(err);
      }

      res.json({message: 'foodtruck saved successfully'});
    });
  });


  // 'v1/foodtruck'  - Read
  api.get('/', (req, res) =>{
    console.log("get all foodtrucks");
    FoodTruck.find({}, (err, foodtrucks) =>{
      if (err){
        res.send(err);
      }

      res.json(foodtrucks);
    })
  });

  // 'v1/foodtruck/:id' Read 1
  api.get('/:id', (req, res) =>{
    console.log("get foodtruck id= ", req.params.id);
    FoodTruck.findById(req.params.id, (err, foodtruck) =>{
      if (err){
        res.send(err);
      }

      res.json(foodtruck);

    });
  });

  // 'v1/foodtruck/:id'  PUT 1
  api.put('/:id', (req, res) => {
    console.log("update foodtruck id= ", req.params.id);
    FoodTruck.findById(req.params.id, (err, foodtruck) => {
      if (err){
        res.send(err);
      }

      foodtruck.name = req.body.name;

      foodtruck.save(err => {
        if (err) {
          res.send(err);
        }

        res.json({ message: "FoodTruck info updated"});

      });
    });
  });

  // 'v1/foodtruck/:id'  DELETE 1
  api.delete('/:id', (req, res) => {
    console.log("delete foodtruck id = ", req.params.id);
    FoodTruck.findById(req.params.id, (err, foodtruck) => {
      if (err){
        res.send(err);
      }

      console.log("FoodTruck found in delete operation", foodtruck["name"]);

      FoodTruck.remove({_id: req.params.id}, (err, foodtruck) => {
        if (err){
          res.send(err);
        }
        console.log("FoodTruck remove did not return err ID=", req.params.id);

        res.json({message: "FoodTruck Successfully Removed"});
      });

    });
  });


  //add review for a speicifc foodtruck id
  // '/v1/foodtruck/reviews/add/:id'
  api.post('/reviews/add/:id', (req, res) =>{
      console.log("add reviews for foodtruck id= ", req.params.id);
      FoodTruck.findById(req.params.id, (err, foodtruck) =>{
        if (err){
          res.send(err);
        }

        console.log("add review, foodtruck found id = ", foodtruck._id);

        let newReview = new Review();

        newReview.title = req.body.title;
        newReview.text = req.body.text;
        newReview.foodtruck = foodtruck._id;
        console.log("add review, review => ", newReview);

        newReview.save((err, review) => {
          if (err){
            console.log("add review, failed => ", err);
            res.send(err);
          }

          console.log("add review, ok => ", newReview);
          foodtruck.reviews.push(newReview);
          foodtruck.save((err, foodtruck) =>{
            if (err){
              res.send(err);
            }
            res.json({ message: 'Food truck review saved'});

          });
        });
      });
    });


  // get foodtype
  // '/v1/foodtruck/foodtype/:foodtype'
  api.get('/foodtype/:foodtype', (req, res) => {
    console.log("getting foodtruck by the type of food", req.params.foodtype);
    FoodTruck.find({foodtype: req.params.foodtype}, (err, foodtrucks) =>{
      if (err){
        res.send(err);
      }

      res.json(foodtrucks);

    });
  });

  // get reivews for a speicifc foodtruck
  // '/v1/foodtruck/reviews/:id'
  api.get('/reviewsByTruck/:id', (req, res) => {
    console.log("get reviews for a single foodtruck");
    Review.find({foodtruck: req.params.id}, (err, reviews) =>{
      if (err){
        res.send(err);
      }

      res.json(reviews);

    });
  });



  // get all reivews
  // '/v1/foodtruck/reviews'
  api.get('/reviews/all', (req, res) => {
    console.log("into get all reviews");

    Review.find({}, (err, reviews) =>{

      console.log("into get all reviews after find");
      if (err){
        console.log("into get all reviews err out", err);
        res.send(err);
      }

      console.log("into get all reviews shoud be okay ");
      res.json(reviews);

    });
  });
  return api;

}
