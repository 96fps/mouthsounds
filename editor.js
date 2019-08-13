function get(url, cb) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.onload = function() {
    cb(this.responseText);
  }
  xhr.send();
}

function get_json(url, cb) {
  get(url, function(x) {
    cb(JSON.parse(x));
  });
}

window.onkeydown = function(ev) {
  if (ev.keyCode == 32) {
    ev.preventDefault();
    $a.pause();
  }
}

var $trans = document.getElementById("transcript");
var $preloader = document.getElementById('preloader');

var wds = [];
var cur_wd;

var $phones = document.createElement("div");
// var $phones = document.getElementById("transcript").createElement("div");
$phones.className = "phones";
document.body.appendChild($phones);

var cur_phones$ = []; // List of phoneme $divs
var $active_phone;

function render_phones(wd) {
  cur_phones$ = [];
  $phones.innerHTML = "";
  $active_phone = null;
  audoi
  $phones.style.top = wd.$div.offsetTop + 18 - 70;
  // $phones.style.top = wd.$div.offsetLeft;
  $phones.style.left = wd.$div.offsetLeft;

  var dur = wd.end - wd.start;

  var start_x = wd.$div.offsetLeft;

  wd.phones
    .forEach(function(ph) {
      var $p = document.createElement("span");
      $p.className = "phone";
      $p.textContent = ph.phone.split("_")[0];

      $phones.appendChild($p);
      cur_phones$.push($p);
    });

  var offsetToCenter = (wd.$div.offsetWidth - $phones.offsetWidth) / 2;
  // var offsetToCenter = ( $phones.offsetWidth) / 2;
  // var offsetToCenter = ($phones.offsetWidth) / 2;

  // $phones.style.left = wd.$div.offsetLeft + offsetToCenter;
  // $phones.style.left = offsetToCenter;

}

function highlight_phone(t) {
  if (!cur_wd) {
    $phones.innerHTML = "";
    return;
  }
  var hit;
  var cur_t = cur_wd.start;

  cur_wd.phones.forEach(function(ph, idx) {
    if (cur_t <= t && cur_t + ph.duration >= t) {
      hit = idx;
    }
    cur_t += ph.duration;
  });

  if (hit) {
    var $ph = cur_phones$[hit];
    if ($ph != $active_phone) {
      if ($active_phone) {
        $active_phone.classList.remove("phactive");
      }
      if ($ph) {
        $ph.classList.add("phactive");
      }
    }
    $active_phone = $ph;
  }
}

function highlight_word() {
  var t = $a.currentTime;
  // XXX: O(N); use binary search
  var hits = wds.filter(function(x) {
    return (t - x.start) > 0.01 && (x.end - t) > 0.01;
  }, wds);
  var next_wd = hits[hits.length - 1];

  if (cur_wd != next_wd) {
    var active = document.querySelectorAll('.active');
    for (var i = 0; i < active.length; i++) {
      active[i].classList.remove('active');
    }

    if (next_wd && next_wd.$div) {
      next_wd.$div.classList.add('active');
      next_wd.$div.style.height = "3.5em";
      next_wd.$div.style.opacity = "1.0";


      // next_wd.$div.classList.add('hidden');
      // next_wd.classList.remove('hidden');

      // next_wd.$div.classList.add('hidden');
      // render_phones(next_wd);
    }
  }
  cur_wd = next_wd;
  highlight_phone(t);


  window.requestAnimationFrame(highlight_word);
}
window.requestAnimationFrame(highlight_word);

var vbox = document.getElementById("transcript");
vbox.style.height = lines * 4 + 0.5 + "em";
// document.getElementById("transcript").style.height=80+"%";    

$trans.innerHTML = "Loading...";

function render(ret, ex) {
  wds = ret['words'] || [];
  transcript = ret['transcript'];

  $trans.innerHTML = '';

  var currentOffset = 0;

  wds.forEach(function(wd) {
    if (wd.case == 'not-found-in-transcript') {
      // TODO: show phonemes somewhere
      var txt = ' ' + wd.word;
      var $plaintext = document.createTextNode(txt);
      $trans.appendChild($plaintext);
      return;
    }

    // Add non-linked text
    if (wd.startOffset > currentOffset) {
      // var txt = transcript.slice(currentOffset, wd.startOffset);
      // var $plaintext = document.createTextNode(txt);
      // $trans.appendChild($plaintext);
      currentOffset = wd.startOffset;
    }

    var $wd = document.createElement('span');
    var txt = transcript.slice(wd.startOffset, wd.endOffset);


    var $wdText = document.createTextNode(txt);
    // $wd.appendChild($wdText);
    var word = document.createElement('span');
    word.className = 'word';
    word.appendChild($wdText);
    wd.$div = $wd;
    if (wd.start !== undefined) {
      $wd.className = 'success';
      // $wd.style.height="0px";
      // $wd.style.opacity="0.25";
      // $wd.style.opacity = "0.75";

      var dur = wd.end - wd.start;
      var wid = (dur / measure);
      var lineno = Math.floor((wd.start + offset) / measure);
      var shift = ((wd.start + offset) / measure) - lineno;
      if(ex['offset']<0.0){lineno++;}
      $wd.style.width = wid * 100 + "%";
      $wd.style.left = shift * 100 + "%";
      $wd.style.top = (lineno) * 4 + 0.25 + "em";

      if (ex['images']) {
        var x = document.createElement("IMG");
        // x.src="wave.png";
        // x.src="speci.png";
        x.src = ex['loc'] + "spectrogram.png";
        x.style.position = "absolute";
        x.style.top = "0";
        x.style.left = -(wd.start / dur) * 100 + "%";
        // x.style.height="100%";
        // x.style.top="-705%";
        // x.style.height="800%";
        // x.style.top="-310%";
        // x.style.height="400%";
        x.style.top = "0%";
        x.style.height = "100%";
        // x.style.opacity="0";
        x.style.opacity = "0.5";
        x.style.width = audio_duration / dur * 100 + "%";
        $wd.appendChild(x);

        var y = document.createElement("IMG");
        y.src = ex['loc'] + "waveform.png";
        y.style.position = "absolute";
        y.style.top = "25%";
        y.style.left = -(wd.start / dur) * 100 + "%";
        y.style.opacity = "0.75";
        y.style.height = "50%";
        y.style.width = audio_duration / dur * 100 + "%";
        $wd.appendChild(y);
      }
      var spec = document.createElement('span');

      wd.phones.forEach(function(ph) {
        var $p = document.createElement("span");
        $p.className = "phone";
        $p.textContent = ph.phone.split("_")[0];
        // $p.style.width = ph.duration/measure*wid*100+"%";
        $p.style.width = ph.duration / dur * 100 + "%";

        spec.appendChild($p);
        // cur_phones$.push($p);


      });
      spec.className = 'phones';
      $wd.appendChild(spec);
      $wd.appendChild(word);


      if (shift + wid > 1.0) {
        var wd2 = $wd.cloneNode(true);
        wd2.style.left = (shift - 1) * 100 + "%";
        wd2.style.top = (1 + lineno) * 4 + 0.25 + "em";
        $trans.appendChild(wd2);

      }
      $trans.appendChild($wd);

    

    $wd.onclick = function() {
      if (wd.start !== undefined) {
        console.log(wd.start);
        $a.currentTime = wd.start;
        // $inst.currentTime = wd.start;
        $a.play();
      }
    };
    }
    vbox.style.height = lines * 4 + 0.5 + "em";

    // $trans.appendChild($wd);
    currentOffset = wd.endOffset;
  });

  var txt = transcript.slice(currentOffset, transcript.length);
  var $plaintext = document.createTextNode(txt);
  $trans.appendChild($plaintext);
  currentOffset = transcript.length;
}

function show_downloads() {
  var $d = document.getElementById("downloads");
  $d.textContent = "Download as: ";
  var uid = window.location.pathname.split("/")[2];
  // Name, path, title, inhibit-on-file:///
  [
    ["CSV", "align.csv", "Word alignment CSV"],
    ["JSON", "align.json", "JSON word/phoneme alignment data"],
    ["Zip", "/zip/" + uid + ".zip", "Standalone zipfile", true]
  ]
  .forEach(function(x) {
    var $a = document.createElement("a");
    $a.className = "download";
    $a.textContent = x[0];
    $a.href = x[1];
    $a.title = x[2];
    if (!x[3] || window.location.protocol != "file:") {
      $d.appendChild($a);
    }
  });
}

var status_init = false;
var status_log = []; // [ status ]
var $status_pro;

function render_status(ret) {
  if (!status_init) {
    // Clobber the $trans div and use it for status updates
    $trans.innerHTML = "<h2>transcription in progress</h2>";
    $trans.className = "status";
    $status_pro = document.createElement("progress");
    $status_pro.setAttribute("min", "0");
    $status_pro.setAttribute("max", "100");
    $status_pro.value = 0;
    $trans.appendChild($status_pro);

    status_init = true;
  }
  if (ret.status !== "TRANSCRIBING") {
    if (ret.percent) {
      $status_pro.value = (100 * ret.percent);
    }
  } else if (ret.percent && (status_log.length == 0 || status_log[status_log.length - 1].percent + 0.0001 < ret.percent)) {
    // New entry
    var $entry = document.createElement("div");
    $entry.className = "entry";
    $entry.textContent = ret.message;
    ret.$div = $entry;

    if (ret.percent) {
      $status_pro.value = (100 * ret.percent);
    }

    if (status_log.length > 0) {
      $trans.insertBefore($entry, status_log[status_log.length - 1].$div);
    } else {
      $trans.appendChild($entry);
    }
    status_log.push(ret);
  }
}