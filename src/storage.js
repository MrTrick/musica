//==============================================================================
//Import configuration from the environment.
//(or the .env file, if defined)

require('dotenv').config();
const endPointServer = process.env.MUSICA_STORAGE_SERVER;
const endPointPort = process.env.MUSICA_STORAGE_PORT;
const endPointUseSSL = process.env.MUSICA_STORAGE_USESSL || false;
const accessKey = process.env.MUSICA_ACCESS_KEY;
const secretKey = process.env.MUSICA_SECRET_KEY;
const bucketName = process.env.MUSICA_BUCKET_NAME;
const publicBaseUrl =
  process.env.MUSICA_STORAGE_BASEURL ||
  `${endPointUseSSL?'https':'http'}://${endPointServer}:${endPointPort}/${bucketName}/`;

//==============================================================================
const Minio = require('minio');
const streamToString = require('stream-to-string');

const client = new Minio.Client({
    endPoint: endPointServer,
    port: +endPointPort,
    accessKey: accessKey,
    secretKey: secretKey,
    useSSL: endPointUseSSL
});

function readMetadata(name) {
  return client.getObject(bucketName, name)
    .then(streamToString)
    .then((str)=>JSON.parse(str))
    .then((data)=>{
      //Prepend the base url to the source values
      Object.keys(data.src).forEach((k)=>{
        data.src[k] = publicBaseUrl + data.src[k];
      });
      return data;
    });
}
//==============================================================================

/**
 * Fetch the metadata for the given song
 * @param  {string} song_id song UUID
 * @return Promise resolving with metadata object
 */
exports.read = function(song_id) {
  const name = `metadata/${song_id}.json`;
  return readMetadata(name);
}

/**
 * Build and return the index of all song metadata
 * @return Promise resolving with metadata object array
 */
exports.index = function() {
  return new Promise((resolve, reject)=>{
    let operations = [];

    //Get all indices
    let list = client.listObjects(bucketName, 'metadata/', true);
    //Read each one
    list.on('data', (obj)=>operations.push(readMetadata(obj.name)));

    //When every index file has been found and read, return them.
    list.on('end', ()=>Promise.all(operations).then(resolve).catch(reject));

    list.on('error', reject);
  });
}
