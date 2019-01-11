/**
 * Abstract storage, to allow any kind of backend.
 * Each storage engine object must implement the interface:
 * Storage {
 *   constructor(options)
 *   readMetadata(id)
 *   indexMetadata()
 *   existsMetadata(id)
 *   writeMetadata(metadata)
 *   writeMediaFile(local, server)
 *   establishStorage(options)
 *   clearStorage(options)
 * }
 *
 * @license MIT License (c) copyright 2018 Patrick Barnes
 * @author Patrick Barnes
 */

/**
 * Default options
 * @return {object}
 */
function defaults() {
  return {
    type: process.env.MUSICA_STORAGE_TYPE || 's3'
  };
}

const storagePath = './storage';

/**
 * Factory to build the configured type of storage engine.
 * Uses MUSICA_STORAGE_TYPE or options.type if given.
 * Passes options through to engine constructor.
 *
 * @param  {object} options  Any options for the builder or engine
 * @return {Storage}         Storage engine
 */
function storageBuilder(options) {
  options = Object.assign(defaults(), options);
  const type = options.type;
  if (!type) throw new Error('Must specify storage type');

  const path = `${storagePath}/${type}`;

  var Storage = null;
  try {
    Storage = require(path);
  } catch(inner) {
    if (inner.code === 'MODULE_NOT_FOUND') {
      throw Object.assign(new Error(`Could not find '${type}' storage engine`), {inner});
    } else {
      throw inner;
    }
  }

  return new Storage(options);
}

module.exports = storageBuilder;
