changeContent(
    'Đang load vui lòng đợi!'
);

const form = document.createElement('div');
form.classList.add('form-inline', 'my-2', 'my-lg-0');
const input = document.createElement('input');
input.classList.add('form-control', 'mr-sm-2');
input.type = 'search';
input.placeholder = 'Search';
input.id = "search_key";
input.setAttribute('aria-label', 'Search');
const button = document.createElement('button');
button.classList.add('btn', 'btn-outline-success', 'my-2', 'my-sm-0');
button.type = 'submit';
button.textContent = 'Search';
button.onclick = () => {
    var searchkey = document.getElementById("search_key");
    var checkVideo = document.getElementById('video');
    var checkImage = document.getElementById('image');
    var types = '';
    if (checkVideo.checked) {
        types = 'search_video';
    } else {
        types = 'search_image';
    }
    chrome.storage.local.set({
        type: types,
        search_key_words: searchkey.value
    });
};
const imageInput = document.createElement('input');
imageInput.type = 'checkbox';
imageInput.id = 'image';
imageInput.name = 'media';
imageInput.value = 'image';
imageInput.addEventListener('change', ()=>{
    var checkVideo = document.getElementById('video');
    if (checkVideo.checked) {
        checkVideo.checked = false;
    }
})
const imageLabel = document.createElement('label');
imageLabel.textContent = ' Tìm Hình ảnh  ';
imageLabel.setAttribute('for', 'image');
const videoInput = document.createElement('input');
videoInput.type = 'checkbox';
videoInput.id = 'video';
videoInput.name = 'media';
videoInput.value = 'video';
videoInput.addEventListener('change', ()=>{
    var checkImage = document.getElementById('image');
    if (checkImage.checked) {
        checkImage.checked = false;
    }
})
const videoLabel = document.createElement('label');
videoLabel.textContent = ' Tìm Anime ';
videoLabel.setAttribute('for', 'video');

form.appendChild(input);
form.appendChild(button);
form.appendChild(imageInput);
form.appendChild(imageLabel);
form.appendChild(videoInput);
form.appendChild(videoLabel);
document.getElementById('search-form').appendChild(form);

setInterval(()=>{
    chrome.storage.local.get(['search_key_words', 'type'], (res)=>{
        
        golbal_function(res);
        if (window.location.href.includes('full=true')) {
            document.body.style.height = "700px";
            document.body.style.width = "700px";
        }
        
        
    }); 
},500);
function golbal_function (res) {
    if(res.type == 'search_image') {
        search_image(res.search_key_words);    
    } else if(res.type == 'search_video') {
        searchVideo(res.search_key_words);
    } 
}







function search_image (content) {
    let div = document.createElement('div');
    let divPixiv = document.createElement('div');
    divPixiv.className = 'col-md-4';
    let divPinterest = document.createElement('div');
    divPinterest.className = 'col-md-4';
    var btnPixiv = document.createElement('button');
    btnPixiv.type = 'button';
    btnPixiv.className = 'btn btn-outline-primary';
    btnPixiv.textContent = `Xem ảnh ${content} trên pixiv`;
    btnPixiv.onclick = () => {
        chrome.tabs.create({
            url: `https://www.pixiv.net/en/tags/${content}/artworks?s_mode=s_tag`
        });
    };
    divPixiv.appendChild(btnPixiv);
    var btnPinterest = document.createElement('button');
    btnPinterest.type = 'button';
    btnPinterest.className = 'btn btn-outline-danger';
    btnPinterest.textContent = `Xem ảnh ${content} trên pinterest`;
    btnPinterest.onclick = () => {
        chrome.tabs.create({
            url: `https://www.pinterest.com/search/pins/?q=${content}&rs=typed`
        });
    };
    divPinterest.appendChild(btnPinterest);
    div.appendChild(divPinterest);
    div.appendChild(document.createElement('br'));
    div.appendChild(divPixiv);
    
    changeContent(`Tìm kiếm hình ảnh ${content} trên các trang sau`, div);
}

function searchVideo (content) {
    let div = document.createElement('div');
    div.className = 'card-desk';
    var url = `https://myanimelist.net/search/all?cat=all&q=${content}`;

    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);

    xhr.setRequestHeader("authority", "myanimelist.net");
    xhr.setRequestHeader("accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9");
    xhr.setRequestHeader("accept-language", "en-US,en;q=0.9");
    xhr.setRequestHeader("referer", "https://myanimelist.net/search/all?q=elaina&cat=all");
    xhr.setRequestHeader("sec-fetch-dest", "document");
    xhr.setRequestHeader("sec-fetch-mode", "navigate");
    xhr.setRequestHeader("sec-fetch-site", "same-origin");
    xhr.setRequestHeader("sec-fetch-user", "?1");
    xhr.setRequestHeader("upgrade-insecure-requests", "1");
    xhr.setRequestHeader("user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36");

    xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
        var xhr2 = new XMLHttpRequest();
        xhr2.open("GET", "https://raw.githubusercontent.com/hexzzz2008/Anime-Search/main/server/data/config.json");

        xhr2.onreadystatechange = function () {
        if (xhr2.readyState === 4) {
            var listWebAnime = JSON.parse(xhr2.responseText).url_web_xem_alime;
            console.log(listWebAnime);
            var content = xhr.responseText;
            if (content.includes('<h2 id="anime">Anime</h2>')) {
                var animeHtml = content.split('<h2 id="anime">Anime</h2>')[1].split('</article>')[0];
                let strippedString = animeHtml.replace(/(<([^>]+)>)/gi, "").trim()
                var animes = [];
                var temp = [];
                for (let item of strippedString.split('\n')) {
                    var con = item.trim()
                    if (con.length > 1 && con != 'add' && con.includes('Search for') != true) temp.push(con)
                }
                animes = processAnimeList(temp);
                var images = [];
                for (let item of animeHtml.split('<img class="lazyload" data-src="')){
                    if(item.includes('https://cdn.myanimelist.net')) {
                        images.push(item.split('"')[0]);
                    }
                } 
                var links = [];
                for (let pages of animeHtml.split('<a href="')) {
                    if (pages.includes('https://myanimelist.net/anime/')) {
                        links.push(pages.split('"')[0]);
                    }
                }
                var a = 0;
                for (let i = 0; i < animes.length; i++) {
                    animes[i]['img_url'] = images[i];
                }
                var a = 0;
                for (let i = 0; i <= links.length; i += 3) {
                    if (links[i-3] != undefined && links[i-1] != undefined) {
                        animes[a]['ani_link'] = links[i-3]
                        animes[a]['ani_video'] = links[i-1]
                        a += 1;
                    }
                    
                }
                var resultHtml = '';
                var a = 0;
                for(var movie of animes) {
                    var item = movie
                    const card = document.createElement('div');
                    card.classList.add('card');

                    const img = document.createElement('img');
                    img.classList.add('card-img-top');
                    img.src = item.img_url;
                    img.alt = item.title;

                    const cardBody = document.createElement('div');
                    cardBody.classList.add('card-body');

                    const title = document.createElement('h5');
                    title.classList.add('card-title');
                    title.textContent = item.title;

                    const score = document.createElement('p');
                    score.classList.add('card-text');
                    score.textContent = `${item.score} / ${item.members}`;

                    cardBody.appendChild(title);
                    cardBody.appendChild(score);

                    const footer = document.createElement('div');
                    footer.classList.add('card-footer');

                    const button1 = document.createElement('button');
                    button1.type = 'button';
                    button1.classList.add('btn', 'btn-outline-primary');
                    button1.textContent = 'Xem chi tiết trên Myanimelist';
                    button1.urlDirect = `${item.ani_link}`
                    button1.addEventListener('click', () => {
                        chrome.tabs.create({
                            url:button1.urlDirect
                        });
                    });

                    const button2 = document.createElement('button');
                    button2.type = 'button';
                    button2.classList.add('btn', 'btn-outline-primary');
                    button2.textContent = 'Xem chi tiết trên Myanimelist (VIDEO)';
                    button2.urlDirect = `${item.ani_video}`
                    button2.addEventListener('click', () => {
                        chrome.tabs.create({
                            url: button2.urlDirect
                        });
                    });
                  

                    
                    footer.appendChild(button1);
                    footer.appendChild(button2);
                    for (let namesite in listWebAnime) {
                        const button = document.createElement('button');
                        button.type = 'button';
                        button.classList.add('btn', 'btn-outline-primary');
                        button.textContent = `Tìm anime này trên ${namesite}`;
                        button.urlDirect = `${listWebAnime[namesite].replace('{find}', item.title)}`
                        button.addEventListener('click', () => {
                            chrome.tabs.create({
                                url: button.urlDirect
                            });
                        });
                        footer.appendChild(button);
                    }
                    card.appendChild(img);
                    card.appendChild(cardBody);
                    card.appendChild(footer);

                    div.appendChild(card);
                }

                changeContent('Danh sách tìm kiếm được', div);
            }
        }};

        xhr2.send();

        


    }};

    xhr.send();
}

function processAnimeList(input) {
    // Initialize an empty array to store the anime objects
    const animeList = [];
  
    // Loop through the input array in groups of 4 elements
    for (let i = 0; i < input.length; i += 4) {
      // Extract the information for each anime
      const title = input[i];
      const typeAndEpisodes = input[i + 1];
      const score = input[i + 2];
      const members = input[i + 3];
  
      animeList.push({
        title: title,
        typeAndEpisodes: typeAndEpisodes,
        score: score,
        members: members
      });
    }
  
    return animeList;
  }
function changeContent (title, content = null) {
    if (title != '') {
        var titleElement = document.getElementById('title');
        titleElement.textContent = '';
        titleElement.textContent = title;
    }
    if (content != null) {
        var contentShow = document.getElementById('content-show');
        contentShow.textContent = '';
        contentShow.appendChild(content);
    }
}
