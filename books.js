const fs = require('fs');
const csvtojson = require('csvtojson');

const readStream = fs.createReadStream('./csv/books.csv');
const writeStream = fs.createWriteStream('output.txt');

readStream.on('error', (err) => console.error(
  'Error reading file:', 
  err
));

writeStream.on('error', (err) => console.error(
  'Error writing to file:', 
  err
));

csvtojson()
  .fromStream(readStream)
  .subscribe(
    (jsonObj) => {
      delete jsonObj.Amount;
      writeStream.write(JSON.stringify(jsonObj) + '\n');
    },
    (error) => console.error(
      'Error during conversion:', 
      error
    ),
    () => {
      writeStream.end();
      console.log('Conversion completed successfully');
    }
  );


// expected format 
// {"book":"The Compound Effect","author":"Darren Hardy","price":9.48}
// {"book":"The 7 Habits of Highly Effective People","author":"Stephen R. Covey","price":23.48}
// {"book":"The Miracle Morning","author":"Hal Elrod","price":21.34}
// {"book":"Influence: The Psychology of Persuasion","author":"Robert B. Cialdini","price":12.99}
// {"book":"The ONE Thing","author":"Gary Keller","price":11.18}