/**
 * musica.js
 * Command-line tool for managing the musica backend.
 * For more information, run `node musica --help`
 * @license MIT License (c) copyright 2018 Patrick Barnes
 * @author Patrick Barnes
 */
require('dotenv/config');

const program = require('commander');
const plimit = require('p-limit');
const { ingestFile } = require('./src/ingest');
const storageBuilder = require('./src/storage');

//==============================================================================

program
  .version('0.1.0')
  .description("Command-line tool for managing the musica backend");

//------------------------------------------------------------------------------

program
  .command('init')
  .description('Create and initialise the data store')
  .option('-t, --type <t>', 'Specify the storage type')
  .option('-f, --force', 'Continue even if the data store already exists')
  .action(function(options) {
    console.log("Connecting to storage...");
    const storage = storageBuilder(options);

    storage.establishStorage(options)
      .then(()=>{
        console.log("Data store initialised and ready for use.");
        process.exit(0);
      }).catch((err)=>{
        console.error("Error: "+err);
        process.exit(1);
      });
  });

//------------------------------------------------------------------------------

program
  .command('insert [files...]')
  .description('Scan, convert and upload any number of audio files.')
  .option('-t, --type <t>', 'Specify the storage type')
  .action(function(files, options) {
    if (files.length == 0) {
      console.error("Error: Must provide at least one input file.");
      process.exit(1);
    }

    const storage = storageBuilder(options);

    console.log(`Have ${files.length} files to process...`);

    const count = { processed: 0, failed: 0 };
    const throttle = plimit(5);
    const throttledIngest = (file)=>throttle(()=>{
      console.log(`Processing ${file}...`);
      return ingestFile(file, storage)
        .then((id)=>{
          console.log(`Finished processing ${file}. ID is ${id}.\n`);
          count.processed++;
        })
        .catch((err)=>{
          console.log(`Failed to process ${file}: ${err}`);
          count.failed++;
        });
    });

    Promise.all(files.map(throttledIngest))
      .then(()=>{
        console.log("Finished");
        console.log(`Processed ${count.processed} audio tracks.`);
        console.log(`Could not process ${count.failed} audio tracks.`);

        process.exit(count.failed ? 1 : 0);
      });
  });

//----------------------------------------------------------------------------

program
  .command('clear')
  .description('Remove any data (audio and metadata) from the data store.')
  .option('-t, --type <t>', 'Specify the storage type')
  .option('-f, --force', 'Must be set, to confirm removal')
  .action(function(options) {
    console.log("Clearing all data...");

    const storage = storageBuilder(options);
    storage.clearStorage(options)
      .then(()=>{
        console.log("Data store cleared successfully.");
        process.exit(0);
      }).catch((err)=>{
        console.error("Error: "+err);
        process.exit(1);
      });
  });

//==============================================================================

program.on('command:*', function () {
  console.error('Invalid command: %s\nSee --help for a list of available commands.', program.args[0]);
  process.exit(1);
});

program.parse(process.argv);
if (program.args.length == 0) program.help();
