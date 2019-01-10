import React from 'react';
import { fake, random, date, internet } from 'faker';
import ReactDOM from 'react-dom';
import Tracks from './Tracks';

const { number } = random;
const choose = random.arrayElement;

const genres = [
  "Alternative Music","Blues","Classical Music","Country Music","Dance Music",
  "Easy Listening","Electronic","European","Hip Hop", "Rap","Indie Pop",
  "Inspirational","Asian Pop","Jazz","Latin Music","New Age","Opera","Pop",
  "R&B","Soul","Reggae","Rock","Folk","World Music"
];

/**
 * Generate random ids in the same format as the server
 * @return {string} Random 32-digit hex string
 */
function fakeId() {
  return random.uuid().replace(/-/g,'');
}

/**
 * Return true or false, with given probability .
 * Use like prob(0.8) ? a : b
 * @param  {float} p [description]
 * @return {bool}
 */
function prob(p) {
  return Math.random() < p;
}

/**
 * Generate a track listing, allowing any fields to be overridden
 * @param  {object?} fields [description]
 * @return {object}        [description]
 */
function fakeTrack(fields = {}) {
  const artist = fields.artist || fake("{{name.firstName}} {{name.lastName}}");
  const artist2 = fake("{{name.firstName}} {{name.lastName}}");
  const id = fields.id || fakeId();
  const server = internet.url();

  const track = Object.assign(
    {
      id: id,
      artist: artist,
      artists: prob(0.9) ? [artist] : [artist, artist2],
      albumartist: prob(0.95) ? undefined : choose([artist, artist2]),
      title: prob(0.9) ? random.words() : null,
      album: prob(0.5) ? random.words() : null,
      created: date.recent(),
      track: choose([
        {no: null, of: null},
        {no: number({min:1, max:16}), of:null},
        (()=>{
          const no = number({min:1, max:16});
          const of = number({min:no, max:16});
          return {of, no};
        })()
      ]),
      year: choose([number(1970,2019), null]),
      genre: [choose([choose([genres]), null])],
      format: {
        duration: number({min:30,max:600,precision:0.00001})
      },
      src: [`${server}/${id}.ogg`,`${server}/${id}.mp3`]
    },
    fields
  );
  //Remove any explicitly 'deleted' attributes
  // (where fields contained [key]:undefined)
  Object.keys(track).forEach((k)=>(track[k]===undefined) && delete track[k]);

  return track;
}

it('tests the mock generator', () => {
  const track = fakeTrack();
  expect(Object.keys(track)).toEqual(expect.arrayContaining([
    'id','artist','artists','title','album','created','track','year','genre','format','src'
  ]));
  expect(track.format).toHaveProperty('duration');
  expect(track.src).toHaveProperty('mp3');
  expect(track.src).toHaveProperty('webm');

  const track2 = fakeTrack({artist:'TESTSTRING'});
  expect(track2.artist).toBe('TESTSTRING');
  const track3 = fakeTrack({newfield:'NEWFIELD'});
  expect(track3.newfield).toBe('NEWFIELD');

  const track4 = fakeTrack({src:undefined});
  expect(track4).not.toHaveProperty('src');
});

it('renders without crashing', () => {
  const tracks = Array(5).fill().map(()=>fakeTrack());

  const div = document.createElement('div');
  ReactDOM.render(<Tracks tracks={tracks} />, div);
  ReactDOM.unmountComponentAtNode(div);
});

//TODO more tests
