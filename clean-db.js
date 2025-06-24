import fs from "fs";

const DB_PATH = "./db.json";

try {
  const data = fs.readFileSync(DB_PATH, "utf-8");
  const json = JSON.parse(data);

  if (!Array.isArray(json.links)) {
    throw new Error("Invalid format: 'links' must be an array.");
  }

  const cleanedLinks = json.links.map((link, index) => ({
    id: (index + 1).toString(), // reset ID starting from "1"
    title: link.title || "",
    url: link.url || "",
    tags: Array.isArray(link.tags) ? link.tags : [] // initialize tags
  }));

  const updatedData = { links: cleanedLinks };

  fs.writeFileSync(DB_PATH, JSON.stringify(updatedData, null, 2));
  console.log("✅ db.json has been cleaned and updated!");
} catch (err) {
  console.error("❌ Error updating db.json:", err.message);
}

