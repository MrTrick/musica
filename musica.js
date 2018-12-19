/**
 * musica.js
 * Command-line tool for managing the musica backend.
 * For more information, run `node musica --help`
 * @license MIT License (c) copyright 2018 Patrick Barnes
 * @author Patrick Barnes
 */

const program = require('commander');
const plimit = require('p-limit');
const { ingestFile } = require('./src/ingest');
const Storage = require('./src/storage');


//==============================================================================

program
  .version('0.1.0')
  .description("Command-line tool for managing the musica backend");

//------------------------------------------------------------------------------

program
  .command('init')
  .description('Create and initialise the data store')
  .option('-f, --force', 'Continue even if the data store already exists')
  .action(function(options) {
    console.log("Connecting to storage...");
    const storage = new Storage();
    storage.configureStorage(options)
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
  .action(function(files) {
    if (files.length == 0) {
      console.error("Error: Must provide at least one input file.");
      process.exit(1);
    }

    console.log(`Have ${files.length} files to process...`)

    const count = { processed: 0, failed: 0 };
    const throttle = plimit(5);
    const throttledIngest = (file)=>throttle(()=>{
      console.log(`Processing ${file}...`);
      return ingestFile(file)
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

//==============================================================================

program.on('command:*', function () {
  console.error('Invalid command: %s\nSee --help for a list of available commands.', program.args[0]);
  process.exit(1);
});

program.parse(process.argv);
if (program.args.length == 0) program.help();
