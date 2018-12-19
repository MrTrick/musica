/**
 * Handle media ingest / transcoding concerns
 * @license MIT License (c) copyright 2018 Patrick Barnes
 * @author Patrick Barnes
 */

const { promisify } = require('util');
const ffmpeg = require('ffmpeg-static');
const mm = require('music-metadata');
const tempFileName = promisify(require('tmp').tmpName);
const execFile = promisify(require('child_process').execFile);
const md5File = promisify(require('md5-file'));
const unlink = promisify(require('fs').unlink);

const Storage = require('./storage');

//==============================================================================

/**
 * Given an audio file,
 * @param {string} file Path to the audio file
 * @return Promise resolving with a metadata object
 */
function scanFile(file) {
  return mm.parseFile(file, {native: true})
    .then( (raw)=> {
      //Extract just the most useful info from the metadata
      let metadata = raw.common;
      metadata.format = raw.format;
      //Put in some defaults
      metadata.title = metadata.title || 'Untitled Track';
      metadata.artist = metadata.artist || 'Untitled Artist';
      //Remove album picture(s), if set. (will be an array of images, poorly serialized)
      delete metadata.picture;

      return metadata;
    });
}

/**
 * Convert and copy the given file into a new format
 * @param  {string} from Path to the input file
 * @param  {string} format Format ('mp3', 'webm', etc) to conver the file
 * @return Promise resolving with the name of the tmp file
 */
function transcodeFile(from, format) {
  const getFileName = tempFileName();
  return getFileName
    .then((to)=>execFile(ffmpeg.path, ['-n', '-v', '20', '-i', from, '-f', format, to]))
    .then(()=>getFileName);
}

//==============================================================================

/**
 * Main ingest process for new Audio
 *
 * - Generate an id hash,
 * - Scan the file for metadata,
 * - Transcode the audio into webm and mp3 formats,
 * - Upload metadata and audio.
 *
 * @param  {string} file  Location of the audio file
 * @return Promise that resolves when complete with the id.
 */
function ingestFile(file) {
  var storage = new Storage();

  //Scan and convert the files
  var getId = md5File(file);
  var getFileMetadata = scanFile(file);
  var checkExists = getId.then((id)=>storage.existsMetadata(id));
  var transcodedMp3 = transcodeFile(file, 'mp3');
  var transcodedWebm = transcodeFile(file, 'webm');

  //Notify users of progress
  getId.then((id)=>{
    console.log(`  File fingerprint: ${id}`);
  });
  getFileMetadata.then((metadata)=>{
    console.log(`  Scanned successfully: Artist: ${metadata.artist}, Title: ${metadata.title}`);
  });
  transcodedMp3.then(()=>{
    console.log(`  Transcoded audio file to mp3`);
  });
  transcodedWebm.then(()=>{
    console.log(`  Transcoded audio file to webm`);
  });

  //Save the audio into the server when ready
  const saved = Promise.all([getId, checkExists, getFileMetadata, transcodedMp3, transcodedWebm])
    .then(([id, exists, metadata, mp3file, webmfile])=>{
      //Oops - don't overwrite if already there.
      if (exists) {
        console.log(`  Warning - the file ${id} has already been uploaded`);
        return;
      }

      //Push more information into the metadata
      console.log(`  Saving metadata...`);
      metadata.id = id;
      metadata.created = (new Date()).toISOString();
      metadata.src = {
        'mp3': `${id}.mp3`,
        'webm': `${id}.webm`,
      };
      const savedMetadata = storage.writeMetadata(metadata);

      //Save the transcoded media files
      const savedMp3 = storage.writeMediaFile(mp3file, `${id}.mp3`);
      const savedWebm = storage.writeMediaFile(webmfile, `${id}.webm`);

      return Promise.all([savedMetadata, savedMp3, savedWebm]);
    });

  //Clean up the temporary files after they're no longer needed.
  function cleanup() {
    return Promise.all([
      transcodedMp3.then(unlink),
      transcodedWebm.then(unlink)
    ]);
  }
  const cleanedUp = saved.then(cleanup, cleanup);

  //Resolve when the audio is saved and
  // the temp files have been cleaned up,
  // with the id of the audio file.
  return Promise.all([saved, cleanedUp]).then(()=>getId);
}

//==============================================================================

module.exports = { ingestFile };
