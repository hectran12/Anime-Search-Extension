
document.addEventListener('DOMContentLoaded', () => {
    let status_mode = false;
    let input = document.getElementById('fixedLanguageInput');
    let langsetting = document.getElementById('languageSetting');
    let fixedlang = document.getElementById('fixedLanguageDiv');
    let save = document.getElementById('save');
    let speechRateSelect = document.getElementById('speech-rate');
    let speechRate = '1';
     
    chrome.tts.getVoices(
      function(voices) {
        for (var i = 0; i < voices.length; i++) {
          options = document.createElement('option');
          options.value = voices[i].lang;
          options.textContent = `${voices[i].lang} - ${voices[i].voiceName}`;
          input.appendChild(options);
        }
      }
    );
    chrome.storage.local.get(['mode_detect_speak','default_detect', 'speechRate'], (res)=>{
        input.value = res.default_detect;
        status_mode = res.mode_detect_speak;
        speechRate = res.speechRate ? res.speechRate : '1';
        speechRateSelect.value = speechRate;
        if(status_mode == false) {
            langsetting.value = 'Chỉnh mặc định duy nhất 1 ngôn ngữ';
            fixedlang.style.display = 'block';
        }
    });
    speechRateSelect.addEventListener('change', function() {
        speechRate = this.value;
    });
    langsetting.addEventListener('change', () => {
      if (langsetting.value == 'Chỉnh mặc định duy nhất 1 ngôn ngữ') {
        fixedlang.style.display = 'block';
        status_mode = false;
      } else {
        status_mode = true;
        fixedlang.style.display = 'none';
      }
    });

    save.addEventListener('click', ()=>{
        chrome.storage.local.set({
            mode_detect_speak: status_mode,
            default_detect: input.value,
            speechRate: speechRate
        });
    });
});



  