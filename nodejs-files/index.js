const fs = require("fs").promises;
const path = require("path");

async function calculateSalesTotal(salesFiles) {
  let salesTotal = 0;
  // READ FILES LOOP- iterates over the salesFiles array
  for (file of salesFiles) {
    //read the file and parse the contents as JSON
    const data = JSON.parse(await fs.readFile(file));
    //add the amount in the data.total field to the salesTotal variable
    salesTotal += data.total;
  }
  return salesTotal;
}

//create a main method : the entry point for your code
async function main() {
  const salesDir = path.join(__dirname, "stores");
  const salesTotalsDir = path.join(__dirname, "salesTotals");
  //create the salesTotal dir if it doesn't exist
  try {
    await fs.mkdir(salesTotalsDir);
  } catch {
    console.log(`${salesTotalsDir} already exists.`);
  }

  // find paths to all the sales files
  const salesFiles = await findSalesFiles(salesDir);

  // read through each sales file to calculate the sales total
  const salesTotal = await calculateSalesTotal(salesFiles);

  // write the total to the "totals.json"
  await fs.writeFile(
    path.join(salesTotalsDir, "totals.txt"),
    `${salesTotal}\r\n`,
    { flag: "a" }
  );
  console.log(`Wrote sales totals to ${salesTotalsDir}`);
}

async function findSalesFiles(folderName) {
  // this array will hold sales files as they are found
  let salesFiles = [];

  async function findFiles(folderName) {
    //This new method findFiles is created inside the main findSalesMethod method so that it can run as many times as necessary to find all the sales files and populate the salesFiles array. The folderName value is the path to the current folder.

    //read all the item in the current folder
    const items = await fs.readdir(folderName, { withFileTypes: true });
    //iterate every each found item
    // iterate over each found item
    for (item of items) {
      // if the item is a directory, it will need to be searched
      if (item.isDirectory()) {
        // call this method recursively, appending the folder name to make a new path
        await findFiles(path.join(folderName, item.name));
      } else {
        // Make sure the discovered file is a .json file
        if (path.extname(item.name) === ".json") {
          // store the file path in the salesFiles array
          salesFiles.push(path.join(folderName, item.name));
        }
      }
    }
  }
  await findFiles(folderName);
  return salesFiles;
}

main();

// const fs = require("fs").promises;
// const path = require("path");

// const items = await fs.readdir("stores");
// console.log(items);

// const items = await fs.readdir("stores", { withFileTypes: true });
// for (let item of items) {
//   const type = item.isDirectory() ? "folder" : "file";
//   console.log(`${item.name}: ${type}`);
// }

// function findFiles(folderName) {
//   const items = await fs.readdir(folderName, { withFileTypes: true });
//   items.forEach((item) => {
//     if (path.extname(item.name) === ".json") {
//       console.log(`Found file: ${item.name} in folder: ${folderName}`);
//     } else {
//       // this is a folder, so call this method again and pass in
//       // the path to the folder
//       findFiles(path.join(folderName, item.name));
//     }
//   });
// }

// findFiles("stores");
