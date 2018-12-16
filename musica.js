
const program = require('commander');
const { execFile } = require('child_process');
const util = require('util');
const Minio = require('minio');
const mm = require('music-metadata');
const uuidv4 = require('uuid/v4');
const plimit = require('p-limit');
const resolve = Promise.resolve.bind(Promise);
const reject = Promise.reject.bind(Promise);
const get_temp_dir = util.promisify(require('tmp').dir);
const fs = require('fs');
const writeFile = util.promisify(fs.writeFile);

//==============================================================================

program
  .version('0.1.0')
  .description("Command-line tool for managing the musica backend");

//------------------------------------------------------------------------------

program
  .command('check-ffmpeg')
  .description('Check that the ffmpeg tool is installed and available')
  .action(() => {
    console.log("Checking for ffmpeg...");
    ffmpeg_check().then((version)=>{
      console.log(`ffmpeg ${version} found.`);
      process.exit(0);
    }).catch((error)=>{
      console.log(`Error:${error}`);
      process.exit(1);
    });
  });

//------------------------------------------------------------------------------

program
  .command('init')
  .description('Create and initialise the data store')
  .option('-f, --force', 'Continue even if the data store already exists')
  .action(function(options) {
    console.log("Connecting to storage...");
    get_client().then((client)=>
      //Check to see if the bucket has been created
      client.bucketExists(bucketName)
      .then((exists)=>{
        console.log("  Creating bucket...");
        //Create the bucket
        if (!exists) return client.makeBucket(bucketName);
        //Ignore its existence if 'force' is set.
        else if (options.force) return resolve();
        //Error if not.
        else return reject("Data store bucket already exists. Use --force to ignore.");
      })
      .then(()=>console.log("  Bucket created."))
      //Create the access policy
      .then(()=>console.log("  Creating access policy..."))
      .then(()=>client.setBucketPolicy(bucketName, JSON.stringify(bucketPolicy)) )
      .then(()=>console.log("  Policy created."))
     )
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

    console.log("Starting...");
    return Promise.all([
      get_client(),
      get_temp_dir()
    ]).then(([client, tmp_dir])=>{

      var upload_list = [];
      Promise.all(files.map((file)=>{
        const id = uuidv4();

        console.log(`Processing file ${file}:`);
        return scan_file(file).then((metadata)=>{
          console.log(`  Scanned successfully:`);
          console.log(`    Artist: ${metadata.artist}, Title: ${metadata.title}`);

          console.log(`  Converting file ${file}...`);
          return Promise.all(['mp3','webm'].map((ext)=>
            ffmpeg_convert(file, `${tmp_dir}/${id}.${ext}`)
            .then(()=>upload_list.push([`${tmp_dir}/${id}.${ext}`, `${id}.${ext}`]))
          ))
          .then(()=>{
            console.log("  Completed file conversions");
            console.log("  Building and saving metadata...");
            metadata.id = id;
            metadata.created = (new Date()).toISOString();
            metadata.src = {
              'mp3': `${id}.mp3`,
              'webm': `${id}.webm`,
            };
            delete metadata.picture; //(if set will be an array of images, remove for now)
            return writeFile(`${tmp_dir}/${id}.json`, JSON.stringify(metadata))
                  .then(()=>upload_list.push([`${tmp_dir}/${id}.json`, `metadata/${id}.json`]));
          });
        });
      }))
      .then(()=>{
        console.log("Files ready to upload, uploading...");
        return Promise.all(upload_list.map(([from,to])=>{
          console.log(`  ${to}`);
          return client.fPutObject(bucketName, to, from);
        }));
      })
      .then(()=>{ console.log("Success."); });
    });

  });

//==============================================================================

/**
 * Check whether the tool is installed and available
 * @return Promise resolves if installed/available, rejects if not.
 */
function ffmpeg_check() {
  return new Promise((res, rej) => {
    execFile('ffmpeg',['-version'], (err, stdout, stderr) => {
      //Is the tool installed/available?
      if (err) return rej("ffmpeg binary not found. Is it on the path?");

      //Does it behave like expected?
      let match = /^ffmpeg version ((\d+)\.(\d+)\.(\d+))/.exec(stdout);
      if (!match) return rej("ffmpeg response not recognised. Are you sure it is the proper version?");

      //Is it a recent enough version?
      let [,version,major,minor,patch] = match;
      if ( [major,minor,patch] < [2, 8, 1] ) {
        console.error(`Warning: ffmpeg version (${version}) is older than as tested. (2.8.1)`);
      }
      res(version);
    });
  });
}

/**
 * Convert and copy the given file into a new format
 * @param  {string} from Path to the input file
 * @param  {string} to Path to the output file
 * @return Promise resolving with time taken when the conversion is complete.
 */
function ffmpeg_convert(from, to) {
  return new Promise((res, rej) => {
    execFile(
      'ffmpeg',
      ['-n', '-v', '20', '-i', from, to],
      (err, stdout, stderr)=>err ? rej(err) : res(to)
    );
  });
}

/**
 * Given an audio file, assign it an ID and return its metadata
 * @return Promise resolving with the metadata
 */
function scan_file(file) {
  return mm.parseFile(file, {native: true})
  .then( (raw)=> {
    //Extract just the most useful info from the metadata
    let metadata = raw.common;
    metadata.format = raw.format;
    return metadata;
  });
}

//==============================================================================

require('dotenv').config();
const endPointServer = process.env.MUSICA_STORAGE_SERVER;
const endPointPort = process.env.MUSICA_STORAGE_PORT;
const endPointUseSSL = process.env.MUSICA_STORAGE_USESSL || false;
const accessKey = process.env.MUSICA_ACCESS_KEY;
const secretKey = process.env.MUSICA_SECRET_KEY;
const bucketName = process.env.MUSICA_BUCKET_NAME;
//TODO: Should the first part of this policy be available?
const bucketPolicy = {
  Version: "2012-10-17",
  Statement: [ {
    Effect: "Allow",
    Principal: { AWS:["*"] },
    Action: [ "s3:GetBucketLocation", "s3:ListBucket" ],
    Resource: [ `arn:aws:s3:::${bucketName}` ]
  }, {
    Effect: "Allow",
    Principal: { AWS:["*"] },
    Action: [ "s3:GetObject" ],
    Resource: [ `arn:aws:s3:::${bucketName}/*` ]
  }]
};

/**
 * Get instance of the minio storage client
 * @return Promise resolving with client object
 */
function get_client() {
  try {
    return Promise.resolve(new Minio.Client({
      endPoint: endPointServer,
      port: +endPointPort,
      accessKey: accessKey,
      secretKey: secretKey,
      useSSL: endPointUseSSL
    }));
  } catch(e) {
    return Promise.reject(e);
  }
}

//==============================================================================

program.parse(process.argv);
if (program.args.length == 0) program.help();
