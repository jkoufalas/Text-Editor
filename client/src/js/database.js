import { openDB } from "idb";
//import indexedDB

//create db or open existing
const initdb = async () =>
  openDB("jate", 1, {
    upgrade(db) {
      //if database exists then return as nothing to do
      if (db.objectStoreNames.contains("jate")) {
        console.log("jate database already exists");
        return;
      }
      //otherwise we need to create the database
      db.createObjectStore("jate", { keyPath: "id", autoIncrement: true });
      console.log("jate database created");
    },
  });

//adds to the indexed db
export const putDb = async (content) => {
  //open connection to database
  const todosDb = await openDB("jate", 1);
  //set transaction type/ permissions to database
  const tx = todosDb.transaction("jate", "readwrite");
  //connect to store in database
  const store = tx.objectStore("jate");

  //when creating content codemirror makes the entire editor content a single string each new line is a \n
  //therefore each content being saved is the entire text file,
  //so we delete the old one as this would result in the new added to the old in entriety
  const delrequest = store.clear();
  const delresult = await request;
  //then we add the new content as it holds everything
  const request = store.add({ content: content });
  const result = await request;
};

// TODO: Add logic for a method that gets all the content from the database
export const getDb = async () => {
  //open connection to database
  const todosDb = await openDB("jate", 1);
  //set transaction type/ permissions to database
  const tx = todosDb.transaction("jate", "readonly");
  //connect to store in database

  const store = tx.objectStore("jate");

  //get all data from database
  const request = store.getAll();
  const results = await request;
  //because we need to return a string to codemirror, we need to deconstruct the content from a JSON object
  //we therefore map it to access the content value and add to array
  let arrayContent = [];
  results.map((result) => arrayContent.push(result.content));
  //since the content holds the entire file with each line separated by a \n we join the array so that it is a single string required by the codemirror setValue
  return arrayContent.join();
};

initdb();
