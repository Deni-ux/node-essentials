const express = require("express");
const app = express();
const port = 3000;

let bodyParser = require("body-parser");
app.use(bodyParser.json());

let products = [];

//To implement CRUD
//app.route('/products').get().post().put().delete()

//IMPLEMENT WRITING
app.post("/products", function (req, res) {
  //  1st reload: the api responded w an empty array
  //write data
  //The new code reads incoming data from req.body and constructs a JavaScript object from it.Next, it's added to the products array. Finally, the new product is returned to the user.
  const newProduct = { ...req.body, id: products.length + 1 };
  products = [...products, newProduct];
  res.json(newProduct);
});

//IMPLEMENT ABILITY TO UPDATE DATA
app.put("/products", function (req, res) {
  let updatedProduct;
  products = products.map((p) => {
    if (p.id === req.body.id) {
      updatedProduct = { ...p, ...req.body };
      return updatedProduct;
    }
    return p;
  });
  res.json(updatedProduct);
});

//IMPLEMENT DELETE
app.delete("/products/:id", function (req, res) {
  const deletedProduct = products.find((p) => p.id === +req.params.id);
  products = products.filter((p) => p.id !== +req.params.id);
  res.json(deletedProduct);
});

app.get("/products", (req, res) => {
  res.json(products);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
