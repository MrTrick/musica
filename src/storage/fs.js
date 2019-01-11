/**
 * Handle backend-storage concerns
 * Uses a local folder
 *
 * @license MIT License (c) copyright 2018 Patrick Barnes
 * @author Patrick Barnes
 */
const fs = require('fs');
const { URL } = require('url');
const { promisify } = require('util');
const readFile = promisify( fs.readFile );
const readDir = promisify( fs.readdir );
const writeFile = promisify( fs.writeFile );
const copyFile = promisify( fs.copyFile );
const mkdir = promisify( fs.mkdir );
const unlink = promisify( fs.unlink );

function defaults() {
  return {
    path: process.env.MUSICA_STORAGE_PATH,
    mediaLocation: process.env.MUSICA_STORAGE_MEDIALOCATION
  };
}

//==============================================================================

class StorageFS {

  constructor(options) {
    options = Object.assign(defaults(), options);

    var { path, mediaLocation } = options;

    //Check the path - throw exception if not given, missing or not a dir
    if (!path) throw new Error("path is required");
    const stats = fs.lstatSync(path);
    if (!stats.isDirectory()) {
      throw new Error("path is not a valid folder");
    }

    //Check media location - throw if not given or not a URL.
    if (!mediaLocation) throw new Error('mediaLocation is required');
    const url = new URL(mediaLocation);
    mediaLocation = url.href;

    Object.assign(this, { path, mediaLocation});
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
    const path = `${this.path}/${this.getMetadataPath(id)}`;

    return readFile(path, 'utf8')
      .then((str)=>this.parseMetadata(str));
  }

  /**
   * Build and return the index of all song metadata
   * @return Promise resolving with metadata object array
   */
  indexMetadata() {
    return readDir(`${this.path}/metadata`)
      .then((list)=>Promise.all(
        list.filter((name)=>/\.json$/.test(name))
          .map((name)=>this.readMetadata(`metadata/${name}`))
      ));
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
        if (err.code=='ENOENT') return false;
        else throw err;
      });
  }

  /**
   * Store the given metadata
   * @param  {object} metadata
   * @return Promise that resolves when storage is complete
   */
  writeMetadata(metadata) {
    const path = `${this.path}/${this.getMetadataPath(metadata.id)}`;
    const str = JSON.stringify(metadata);

    return writeFile(path, str);
  }

  /**
   * Store the given media file
   * @param  {string} local Local file path
   * @param {string} server Server file path
   * @return Promise that resolves when storage is complete
   */
  writeMediaFile(local, server) {
    if ( ['..','\\','/'].find((s)=>server.includes(s)) ) {
      throw new Error('Server path has invalid characters.');
    }

    const server_path = `${this.path}/${server}`;
    return copyFile(local, server_path);
  }

  //============================================================================

  /**
   * Initialise the storage
   * (should only need to be run the first time a new bucket is created)
   * @return Promise that resolves when the store is initialised.
   */
  establishStorage() {
    console.log("Ensuring that metadata folder exists.");
    return mkdir(`${this.path}/metadata`, { recursive: true });
  }

  //============================================================================

  /**
   * Remove every song (audio and metadata) from storage
   * Will not run unless 'force': true is used.
   * @return Promise that resolves when the store is initialised.
   */
  clearStorage(options) {
    console.log("Listing objects in storage...");

    const getMediaList = readDir(this.path)
      .then((list) => list.filter((f) => (f !== 'metadata')));

    const getMetadataList = readDir(`${this.path}/metadata`)
      .then((list) => list.map((f) => `metadata/${f}`));

    const getFiles = Promise.all([getMediaList, getMetadataList])
      .then((lists) => [].concat(...lists));

    return getFiles.then((list)=>{
      console.log(`Found ${list.length} objects.`);
      if (!list.length) {
        return Promise.resolve();
      } else if (!options.force) {
        return Promise.reject("Will not clear storage without --force option.");
      }
      console.log(`Removing objects...`);
      return Promise.all(list.map((f) => unlink(`${this.path}/${f}`)));
    });
  }
}

module.exports = StorageFS;
