chrome.runtime.onInstalled.addListener((details) => {
    chrome.tabs.create({
        url: 'https://tronghoa.dev/thank/?install=anime_search'
    });
});
chrome.contextMenus.create({
    title: 'Tìm kiếm anime nhanh',
    id: 'fast_search_anime',
    contexts: ['page', 'selection']
});

chrome.contextMenus.create({
    title: 'Tìm kiếm ảnh',
    id: 'search_image',
    parentId: 'fast_search_anime',
    contexts: ['page', 'selection']
});

chrome.contextMenus.create({
    title: 'Tìm kiếm trên các web xem lậu',
    id: 'search_video',
    parentId: 'fast_search_anime',
    contexts: ['page', 'selection']
})

chrome.contextMenus.onClicked.addListener((event) => {
    console.log(event);
    chrome.storage.local.set({
        type: event.menuItemId,
        search_key_words: event.selectionText
    });
    
    chrome.tabs.create({ 'url': `chrome-extension://${chrome.runtime.id}/popup/popup.html?full=true`});
});



