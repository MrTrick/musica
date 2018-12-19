/**
 * Handle backend-storage concerns
 * @license MIT License (c) copyright 2018 Patrick Barnes
 * @author Patrick Barnes
 */

require('dotenv/config');
const Minio = require('minio');
const getStream = require('get-stream');

function defaults() {
  return {
    server: process.env.MUSICA_STORAGE_SERVER,
    port: process.env.MUSICA_STORAGE_PORT,
    useSSL: process.env.MUSICA_STORAGE_USESSL || false,
    accessKey: process.env.MUSICA_ACCESS_KEY,
    secretKey: process.env.MUSICA_SECRET_KEY,
    bucketName: process.env.MUSICA_BUCKET_NAME,
    mediaLocation: process.env.MUSICA_STORAGE_MEDIALOCATION
  };
}

//==============================================================================

class Storage {

  constructor(options) {
    options = Object.assign(defaults(), options);

    //Check/initialise class parameters
    this.bucketName = options.bucketName;
    const validBucketName = /(?=^.{3,63}$)(?!^(\d+\.)+\d+$)(^(([a-z0-9]|[a-z0-9][a-z0-9-]*[a-z0-9])\.)*([a-z0-9]|[a-z0-9][a-z0-9-]*[a-z0-9])$)/;
    if (!this.bucketName) {
      throw new Error("Bucket name is required");
    } else if (!validBucketName.test(this.bucketName)) {
      throw new Error("Invalid bucket name - see S3 restrictions on bucket names.");
    }
    this.mediaLocation = options.mediaLocation
      ? options.mediaLocation.replace(/\/$/,'')
      : ((options.useSSL?'https://':'http://')+options.server+(options.port?(':'+options.port):'')+'/'+this.bucketName);

    //Build the storage client
    this.client = new Minio.Client({
      endPoint: options.server,
      port: +options.port,
      accessKey: options.accessKey,
      secretKey: options.secretKey,
      useSSL: options.useSSL
    });
  }

  getMetadataPath(id_or_path) {
    if (/^metadata\/.*\.json$/.test(id_or_path)) return id_or_path;
    else return `metadata/${id_or_path}.json`;
  }

  mediaNameToURL(name) {
    return this.mediaLocation + '/' + name;
  }

  parseMetadata(str) {
    let metadata = JSON.parse(str);

    //Convert the media file names to absolute URLs
    let src = metadata.src;
    Object.keys(src).forEach((k)=>src[k]=this.mediaNameToURL(src[k]));

    return metadata;
  }

  //============================================================================

  /**
   * Fetch the metadata for the given song
   * @param  {string} song_id song UUID (or path)
   * @return Promise resolving with metadata object
   */
  readMetadata(id) {
    const path = this.getMetadataPath(id);

    return this.client.getObject(this.bucketName, path)
      .then(getStream)
      .then((str)=>this.parseMetadata(str));
  }

  /**
   * Build and return the index of all song metadata
   * @return Promise resolving with metadata object array
   */
  indexMetadata() {
    var stream = this.client.listObjects(this.bucketName, 'metadata/', true);

    return getStream.array(stream)
      .then((list)=>Promise.all(list.map(({name})=>this.readMetadata(name))));
  }

  /**
   * Check whether metadata exists for the given id
   * @param  {string} song_id song UUID (or path)
   * @return Promise resolving with true or false
   */
  existsMetadata(id) {
    return this.readMetadata(id)
      .then(()=>true)
      .catch((err)=>{
        if (err.code=='NoSuchKey') return false;
        else throw err;
      });
  }

  /**
   * Store the given metadata
   * @param  {object} metadata
   * @return Promise that resolves when storage is complete
   */
  writeMetadata(metadata) {
    var path = this.getMetadataPath(metadata.id);
    var str = JSON.stringify(metadata);

    return this.client.putObject(this.bucketName, path, str, 'application/json');
  }

  /**
   * Store the given media file
   * @param  {string} local Local file path
   * @param {string} server Server file path
   * @return Promise that resolves when storage is complete
   */
  writeMediaFile(local, server) {
    return this.client.fPutObject(this.bucketName, server, local);
  }

  //============================================================================

  /**
   * Initialise the storage
   * (should only need to be run the first time a new bucket is created)
   * @return Promise that resolves when the store is initialised.
   */
  configureStorage(options) {
    console.log("Checking to see if bucket exists");
    return this.client.bucketExists(this.bucketName)
      .then((exists)=>{
        //Create the bucket
        if (!exists) {
          console.log("Creating bucket");
          return this.client.makeBucket(this.bucketName);
        }
        //Error if the bucket already exists.
        else if (!options.force) {
          return Promise.reject("Data store bucket already exists. Use --force to ignore.");
        }
      })
      .then(()=>{
        console.log("Creating access policy");
        const standardBucketPolicy = {
          Version: "2012-10-17",
          Statement: [ {
            Effect: "Allow",
            Principal: { AWS:["*"] },
            Action: [ "s3:GetObject" ],
            Resource: [ `arn:aws:s3:::${this.bucketName}/*` ]
          }]
        };
        return this.client.setBucketPolicy(this.bucketName, JSON.stringify(standardBucketPolicy));
      });
  }
}

module.exports = Storage;
