import fs from "fs";
import csv from "csvtojson";

csv()
  .fromFile("your-file.csv")
  .then((jsonObj) => {
    const wrapped = { links: jsonObj };
    fs.writeFileSync("new-db.json", JSON.stringify(wrapped, null, 2));
    console.log("✅ new-db.json created with links array");
  });
