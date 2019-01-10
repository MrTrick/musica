import { fake, random, date, internet } from 'faker';

const { number } = random;
const choose = random.arrayElement;

export const genres = [
  "Alternative Music","Blues","Classical Music","Country Music","Dance Music",
  "Easy Listening","Electronic","European","Hip Hop", "Rap","Indie Pop",
  "Inspirational","Asian Pop","Jazz","Latin Music","New Age","Opera","Pop",
  "R&B","Soul","Reggae","Rock","Folk","World Music"
];

/**
 * Generate random ids in the same format as the server
 * @return {string} Random 32-digit hex string
 */
export function fakeId() {
  return random.uuid().replace(/-/g,'');
}

/**
 * Return true or false, with given probability .
 * Use like prob(0.8) ? a : b
 * @param  {float} p [description]
 * @return {bool}
 */
export function prob(p) {
  return Math.random() < p;
}

/**
 * Generate a track listing, allowing any fields to be overridden
 * @param  {object?} fields [description]
 * @return {object}        [description]
 */
export function fakeTrack(fields = {}) {
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
