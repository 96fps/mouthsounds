/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}
var getJSON = function(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'json';
  xhr.onload = function() {
    var status = xhr.status;
    if (status === 200) {
      callback(null, xhr.response);
    } else {
      callback(status, xhr.response);
    }
  };
  xhr.send();
};
var items;
getJSON('examples/examples.json',
  function(err, data) {
    if (err !== null) {
      alert('Something went wrong: ' + err);
    } else {
      items = document.getElementById("myDropdown")
      items.innerHTML = "";

      examples = data['examples'] || [];
      var entry;
      var title;
      examples.forEach(function(ex) {
        entry = document.createElement("a", "href=");
        title = document.createTextNode(ex['name']);
        entry.appendChild(title);
        entry.onclick = function() {
          // alert(JSON.stringify(ex));
          // items.parentElement.innerHTML = "";

          document.getElementById("dropdown").innerHTML =ex['name'];

                $a.setAttribute("autoplay","false");
                // window.location.hash=ex['name'];
                history.pushState("", document.title, window.location.pathname);

          loadex(ex);
        };
        items.appendChild(entry);
      });
      // entry = document.createElement("a", "href=");
      // title = document.createTextNode("install SW");
      // entry.appendChild(title);
      // entry.onclick = function() { registerSW();};
      // items.appendChild(entry);

      entry = document.createElement("a", "href=");
      title = document.createTextNode("clear serviceWorker");
      entry.appendChild(title);
      entry.onclick = function() { removeSW();alert("Service Worker has been reset!");location.reload(true);
     };
      items.appendChild(entry);

      // entry = document.createElement("a", "href=");
      // title = document.createTextNode("Reset serviceWorker");
      // entry.appendChild(title);
      // entry.onclick = function() { removeSW();registerSW();alert("Service Worker has been reset!");location.reload(true); };
      // items.appendChild(entry);
      if(window.location.hash==="#hogs") {

            loadex(data['examples'][5]);
            $a.play();
        // Fragment exists
        // alert("hi"+window.location.hash);
      } else {
            loadex(data['examples'][0]);
        // alert("bye");
      }

      // loadex(data['examples'][0]);
      // loadex(data['examples'][1]);

    }
  });
var $a = document.getElementById("audio");

var bpm;
var offset;
var audio_duration;

var beatlen;
var measure;
var measures;
var lines;

function doMath() {
  beatlen = 1.0 * bpm / (60.0);
  measure = beatlen * 4.0 / 3.0;
  measures = audio_duration / measure;
  lines = Math.floor((audio_duration + offset) / measure);
      if(offset<0.0){lines++;;}

}

function loadex(ex) {
  var curdir;
  var drawspec = false;
  getJSON(ex['loc'] + ex['align'],
    function(err, data) {
      if (err !== null) {
        alert('Something went wrong: ' + err);
      } else {
        curdir = ex['loc'];
        bpm = ex['bpm'];
        offset = ex['offset'];
        audio_duration = ex['audio_duration'];

        drawspec = ex['images'];

        doMath();
        // console.log(lines);
        render(data, ex);
      }
    });
  $a.src = ex['loc'] + ex['sound'];
  if(window.location.hash==="#hogs") {
    $a.setAttribute("autoplay","true");}
  $a.load();
  // if(window.location.hash==="hogs") {

  //            $a.play();
  //       } 

}
registerSW();
function registerSW(){
  if('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('sw.js')
             .then(function() { console.log('Service Worker Registered'); });
  }
}
function removeSW(){
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
            for (let registration of registrations) {
              registration.unregister()
            }
          });
  console.log("removed");
}