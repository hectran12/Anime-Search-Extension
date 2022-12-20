chrome.runtime.onInstalled.addListener((details) => {
    chrome.storage.local.set({
        mode_detect_speak: true,
        default_detect: 'vi-VN',
        speechRate: '1'
    });
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

chrome.contextMenus.create({
    title: 'Tiện ích khác',
    id: 'different_functions',
    contexts: ['page', 'selection']
})
chrome.contextMenus.create({
    title: 'Đọc to tiêu đề/dòng chữ này',
    id: 'speak_text',
    parentId: 'different_functions',
    contexts: ['page', 'selection']
});

chrome.contextMenus.onClicked.addListener((event) => {
    
    chrome.storage.local.set({
        type: event.menuItemId,
        search_key_words: event.selectionText
    });
    
    if(event.parentMenuItemId == 'different_functions') {
        chrome.tabs.create({
            'url': `chrome-extension://${chrome.runtime.id}/another_functions/index.html#${event.menuItemId}?mode=run`
        });
    } else {
        chrome.tabs.create({ 'url': `chrome-extension://${chrome.runtime.id}/popup/popup.html?full=true`});
    }
    
});