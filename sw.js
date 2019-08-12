var inlineEx={
  "examples": [
    {
      "name": "All The Places",
      "loc": "examples/atp/",
      "align": "align.json",
      "sound": "atp_vocals.mp3",
      "images": true,
      "bpm": 72.22,
    "offset": -1.15,
    "audio_duration": 30.0
    },{
      "name": "Runs in the Family",
      "loc": "examples/palmer/",
      "align": "align.json",
      "sound": "a.wav",
      "images": true,
      "bpm": 55.5,
    "offset": -0.65,
    "audio_duration": 30.0
    },
    {
      "name": "All Star - clip",
      "loc": "examples/allstar/",
      "align": "align.json",
      "sound": "source_v2.wav",
      "images": true,
      "bpm": 104,
    "offset": -0.4,
    "audio_duration": 9.65
    },{
      "name": "All Star - google TTS",
      "loc": "examples/allstar-gtts/",
      "align": "align.json",
      "sound": "a.wav",
      "images": true,
      "bpm": 104,
    "offset": -0.4,
    "audio_duration": 12.31
    },{
      "name": "hogs_espeak",
      "loc": "examples/hogs_espeak/",
      "align": "align.json",
      "sound": "a.wav",
      "images": false,
      "bpm": 104,
    "offset": -0.4,
    "audio_duration": 10.12
    },{
      "name": "hogs_gtts",
      "loc": "examples/hogs_gtts/",
      "align": "align.json",
      "sound": "a.wav",
      "images": false,
      "bpm": 104,
    "offset": -0.4,
    "audio_duration": 12.64
    },
    {
      "name": "Hogs Start Coming",
      "loc": "examples/hogstar/",
      "align": "align.json",
      "sound": "feral_hogs.wav",
      "images": true,
      "bpm": 104,
    "offset": -0.4,
    "audio_duration": 9.65
    }]
};

var cachable=[
  // 'index.html',
  'style.css',
  // 'loader.js',
  // 'editor.js',
  'examples/examples.json'
  ];

 examples = inlineEx['examples'] || [];

        examples.forEach(function(ex) {
        cachable.push(ex['loc']+ex['align']);
        // cachable.push(ex['loc']+ex['sound']);
        if(ex['images']){
          cachable.push(ex['loc']+"spectrogram.png");
          cachable.push(ex['loc']+"waveform.png");
        }
        });
        // console.log(cachable);

self.addEventListener('install', function(e) {
         
       

 e.waitUntil(
   caches.open('video-store').then(function(cache) {
     return cache.addAll(cachable);
   })
 );
});

self.addEventListener('fetch', function(e) {
  console.log(e.request.url);
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});