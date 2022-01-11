const fs = require("fs");
const extract = require("extract-zip");
const path = require("path");
var zipper = require("zip-local");

function runMyscript() {
  const directoryFiles = fs.readdirSync("./scrom_packages");
  var unPackedPathList = [];
  var itemsProcessed = 0;
  directoryFiles.forEach((filename) => {
    extractZipFile(filename).then(function (res) {
      unPackedPathList.push(res);
      itemsProcessed++;
      if (itemsProcessed === directoryFiles.length) {
        goToAllPackages(unPackedPathList);
      }
    });
  });
}

async function goToAllPackages(unPackedPathList) {
//   console.log("I got once all done", unPackedPathList);
}

async function extractZipFile(filename) {
  let storedPath = "/Users/jagadish/scrom-package-modify/playground/" + filename;
  try {
    fs.mkdir(
      path.join("/Users/jagadish/scrom-package-modify/playground", filename),
      (err) => {
        if (err) {
          return console.error(err);
        }
        extract("./scrom_packages/" + filename, { dir: storedPath }).then(
          function (result) {
              console.log("Zip file extacted!!", filename)
            fs.copyFile('player.js', storedPath+'/data/player/player.js', (err) => {
                if (err) console.log(err);
                console.info('player.js was copied to destination scrom package');
                zipDirectory(storedPath, './output', filename);
            });
          }
        );
      }
    );
    return storedPath;
  } catch (err) {
    // handle any errors
    console.log(err);
  }
}

function zipDirectory(sourceDir, outPath, filename) {
    zipper.zip(sourceDir+'/', function(error, zipped) {
        if(!error) {
            zipped.compress(); // compress before exporting
    
            var buff = zipped.memory(); // get the zipped file as a Buffer
    
            // or save the zipped file to disk
            zipped.save(outPath + '/' + filename , function(error) {
                if(!error) {
                    console.info("bundled back saved successfully !");
                }
            });
        }
    });
}
runMyscript(); // Call this method for run script
