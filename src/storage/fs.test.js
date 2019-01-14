/**
 * Jest test file for storage.js
 * @license MIT License (c) copyright 2018 Patrick Barnes
 * @author Patrick Barnes
 */

//Clear any auto-configured defaults
delete process.env.MUSICA_STORAGE_PATH;
delete process.env.MUSICA_STORAGE_MEDIALOCATION;

const Storage = require('./fs');

test('Storage constructor', () => {
  expect(()=>{
    new Storage({path:null});
  }).toThrow(/^path is required$/);
  expect(()=>{
    new Storage({path:'package.json'});
  }).toThrow(/^path is not a valid folder$/);
  expect(()=>{
    new Storage({path:'test', mediaLocation:null});
  }).toThrow(/^mediaLocation is required$/);
});

//TODO: More tests
//TODO: Get 100% coverage
