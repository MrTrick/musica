/**
 * Jest test file for storage.js
 * @license MIT License (c) copyright 2018 Patrick Barnes
 * @author Patrick Barnes
 */

const Storage = require('./storage');

//Clear any auto-configured options
//TODO: Best practices? Is there a *neat* way to bring env vars in
//      that isn't seen when testing?
delete process.env.MUSICA_STORAGE_SERVER;
delete process.env.MUSICA_STORAGE_SERVER;
delete process.env.MUSICA_STORAGE_PORT;
delete process.env.MUSICA_STORAGE_USESSL;
delete process.env.MUSICA_ACCESS_KEY;
delete process.env.MUSICA_SECRET_KEY;
delete process.env.MUSICA_BUCKET_NAME;
delete process.env.MUSICA_STORAGE_MEDIALOCATION;

test('Storage constructor', () => {
  expect(()=>{
    new Storage({bucketName:null});
  }).toThrow(/^Bucket name is required$/);
  expect(()=>{
    new Storage({bucketName:'127.0.0.1'});
  }).toThrow(/^Invalid bucket name/);
  expect(()=>{
    new Storage({bucketName:'MUSICA'});
  }).toThrow(/^Invalid bucket name/);
  expect(()=>{
    new Storage({
      server: 'localhost',
      port: 9000,
      bucketName:'musica-test',
    });
  }).not.toThrow();
  expect((new Storage({
    server: 'localhost',
    port: 9000,
    bucketName:'musica-test',
  })).mediaLocation)
    .toBe('http://localhost:9000/musica-test');
  expect((new Storage({
    server: 'example.com',
    port: 8000,
    bucketName:'musica-test',
    useSSL: true
  })).mediaLocation)
    .toBe('https://example.com:8000/musica-test');
  expect((new Storage({
    server: 'example.com',
    port: 8000,
    bucketName:'musica-test',
    mediaLocation: 'https://cdn.example.com'
  })).mediaLocation)
    .toBe('https://cdn.example.com');
  expect((new Storage({
    server: 'example.com',
    port: 8000,
    bucketName:'musica-test',
    mediaLocation: 'https://cdn.example.com/' //<== Trailing slash!
  })).mediaLocation)
    .toBe('https://cdn.example.com');
});

//Standard set of options to use in the tests
const storageOptions = {
  server: 'localhost',
  port: 8000,
  bucketName:'musica-test',
  mediaLocation: 'https://cdn.example.com',
  accessKey: 'TESTACCESSKEY',
  secretKey: 'TESTSECRETKEY'
};

test('Storage getMetadataPath', () => {
  const storage = new Storage(storageOptions);
  expect(storage.getMetadataPath('foobar'))
    .toBe('metadata/foobar.json');
  expect(storage.getMetadataPath('metadata/foobar.json'))
    .toBe('metadata/foobar.json');
});

//TODO: More tests
//TODO: Mock out the client object
//TODO: Get 100% coverage
