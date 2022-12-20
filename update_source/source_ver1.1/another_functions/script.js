var page = window.location.href;
var title = document.getElementById('title');
let currentLocalStorage = null;
    chrome.storage.local.get(['mode_detect_speak', 'default_detect', 'speechRate'], (res)=>{
        currentLocalStorage = {
            mode_detect_speak: res.mode_detect_speak,
            default_detect: res.default_detect,
            speechRate: res.speechRate
        };
    });
var resetConfig = () => {
    chrome.storage.local.set(currentLocalStorage);
}
if (page.includes('speak_text')) {
    
    title.textContent  = 'Text to speech';
    changeThemeToTTS();
    let voicename = document.getElementById('voice-name');
    var options = document.createElement('option');
    options.value = 'auto_detect';
    options.textContent = `Tự động`;
    voicename.appendChild(options);
    chrome.tts.getVoices(
        function(voices) {
          for (var i = 0; i < voices.length; i++) {
            options = document.createElement('option');
            options.value = voices[i].lang;
            options.textContent = `${voices[i].lang} - ${voices[i].voiceName}`;
            voicename.appendChild(options);
          }
        }
      );
    if (page.includes('mode=run')) {
        chrome.storage.local.get(['search_key_words'], (res)=>{
            speak_text(res.search_key_words);
        });
    }
    var btnSpeak = document.getElementById('speak');
    var btnStop = document.getElementById('stop');
    var btnResume = document.getElementById('resume');
    var btnPause = document.getElementById('pause');
    let text = document.getElementById('text');
    let speed = document.getElementById('speech-rate');
    btnSpeak.addEventListener('click', ()=>{
        document.getElementById('status').className = 'alert alert-success';
        document.getElementById('status').textContent = 'Đang đọc...';
        if(text.value.length < 1) {
            document.getElementById('status').className = 'alert alert-secondary';
            document.getElementById('status').textContent = 'Vui lòng nhập dài hơn 1 kí tự';
        } else {
                chrome.storage.local.set({
                    speechRate: speed.value,
                    mode_detect_speak: voicename.value == 'auto_detect' ? true : false,
                    default_detect: voicename.value
                });
                speak_text(text.value);
        }
    });
    btnPause.addEventListener('click', ()=>{
        chrome.tts.pause();
        document.getElementById('status').className = 'alert alert-warning';
        document.getElementById('status').textContent = 'Đã vào chế độ chờ.';
    });
    btnResume.addEventListener('click', ()=>{
        chrome.tts.resume();
        document.getElementById('status').className = 'alert alert-success';
        document.getElementById('status').textContent = 'Đang tiếp tục';
    });
    btnStop.addEventListener('click', ()=>{
        chrome.tts.stop();
        document.getElementById('status').className = 'alert alert-secondary';
        document.getElementById('status').textContent = 'Đã ngừng đọc.';
    })
    
}


function changeThemeToTTS () {
    document.body.style.height = "auto";
    document.body.style.width = "auto";
    document.body.innerHTML = `
    <div class="container mt-5">
    <h1>Tiện ích đọc to của Anime Search</h1>
    <div class="form-group">
        <label for="text">Văn bản:</label>
        <textarea id="text" class="form-control"></textarea>
    </div>
    <div class="form-group">
  <label for="speech-rate">Tốc độ nói:</label>
    <select id="speech-rate" name="speech-rate" class="form-control">
        <option value="0">Ngừng</option>
        <option value="1">Bình thường</option>
        <option value="1.5">Nhanh hơn</option>
        <option value="2">Rất nhanh</option>
    </select>
    </div>
    <div class="form-group">
        <label for="voice-name">Chất giọng:</label>
        <select id="voice-name" name="voice-name" class="form-control">
          
        </select>
      </div>
    <button type="button" id="speak" class="btn btn-primary">Đọc</button>
    <button type="button" id="stop" class="btn btn-danger">Ngưng</button>
    <button type="button" id="pause" class="btn btn-warning">Ngưng tạm thời</button>
    <button type="button" id="resume" class="btn btn-success">Tiếp</button>
    <hr>
    <div id="status" class="alert alert-light" role="alert">
    
    </div>
    
    <hr>
    <div class="card">
  <img src="../bg-tts.png" class="card-img-top" alt="...">
</div>

    </div>
    `;
}


function speak_text (content) {
    if (content != '') {
        chrome.storage.local.get(['mode_detect_speak','default_detect', 'speechRate'], (res)=>{
            if(res.mode_detect_speak) {
                let effect = 1;
                let inter = setInterval(() => {
                    if (effect > 3) effect = 1;
                    document.getElementById('speak').textContent = '.'.repeat(effect);
                    effect += 1;
                }, 300);
                var url = `https://tronghoa.dev/api/detect_lang.php?content=${content}`;
    
                var xhr = new XMLHttpRequest();
                xhr.open("GET", url);
    
                xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    var parseJson = JSON.parse(xhr.responseText);
                    var lang = parseJson['data']['detections'][0]['language'];
                    speak(content, lang, res.speechRate);
                
                    clearInterval(inter);
                    document.getElementById('speak').textContent = 'Đọc';
                }};
    
                xhr.send();
    
            } else {
                speak(content, res.default_detect, res.speechRate);
            }
        });
        
    } else {
    
        document.getElementById('status').className = 'alert alert-danger';
        document.getElementById('status').textContent = 'Chưa xác định được';
    }

    
    chrome.storage.local.set({
        search_key_words: ''
    });
}


function speak (content, lang, speed) {
    console.log(content, lang, speed);
    let status_action = false;
    chrome.tts.getVoices(
        (voices) => {
          for (var i = 0; i < voices.length; i++) {
            let langs = voices[i].lang;
            if (langs.includes(lang) || langs == lang) {
                chrome.tts.speak(content, {
                    rate: Number.parseInt(speed),
                    lang: langs
                });
                document.getElementById('status').className = 'alert alert-info';
                document.getElementById('status').textContent = 'Đọc xong rồi.';
                status_action = true;
                break;
            }
          }
          resetConfig();
        }
      );
}
