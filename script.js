import { setLS, getLS, savePhotoIdLS, includesPhotoId, findPhotoId, removeLikeLS, saveLikesPhoto } from "./ls.js";

const APIKey = '';
let isFetching = false;
let page = 1;
const iconLike = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20"><g id="_01_align_center" data-name="01 align center"><path d="M17.5.917a6.4,6.4,0,0,0-5.5,3.3A6.4,6.4,0,0,0,6.5.917,6.8,6.8,0,0,0,0,7.967c0,6.775,10.956,14.6,11.422,14.932l.578.409.578-.409C13.044,22.569,24,14.742,24,7.967A6.8,6.8,0,0,0,17.5.917ZM12,20.846c-3.253-2.43-10-8.4-10-12.879a4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,11,7.967h2a4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,22,7.967C22,12.448,15.253,18.416,12,20.846Z"/></g></svg>`;
const iconLikeChoose = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24" width="20" height="20"><path d="M17.5.917a6.4,6.4,0,0,0-5.5,3.3A6.4,6.4,0,0,0,6.5.917,6.8,6.8,0,0,0,0,7.967c0,6.775,10.956,14.6,11.422,14.932l.578.409.578-.409C13.044,22.569,24,14.742,24,7.967A6.8,6.8,0,0,0,17.5.917Z"/></svg>`;
const imageContEl = document.querySelector('#photo-container');

async function getImages(photo) {
    isFetching = true;
    
    try {
        const response = await fetch(`https://api.unsplash.com/photos/${photo}/?`, {headers: { Authorization: `Client-ID ${APIKey} `}});

        if (!response.ok) {
            throw new Error(response.statusText)
        }
        const json = await response.json();
        console.log(json);
        return json; 
    } finally {
        isFetching = false;
    }
    
}
(async function() {
    loadPhoto('random');
})();

async function loadPhoto(partOfLink) {
    try {
        const result  = await getImages(partOfLink);  
        renderImages(result);
        getHistoryTitle();
        const likesArray = getLS();
        processArray(likesArray);
        
    } catch (error) {
        alert(error);
    }
};

function renderImages(image) {
    imageContEl.innerHTML = '';
    imageContEl.insertAdjacentHTML('beforeend', `<img src="${image.urls.regular}" class="photo" alt="${image.alt_description}"></img>`);
    const likesCounter = image.likes;
    
    if (includesPhotoId(image.id)) {
        fillPhotoBottom(image.user.name, iconLikeChoose, likesCounter + 1);
    } else {
        fillPhotoBottom(image.user.name, iconLike, likesCounter);
    }

    const likesEl = document.querySelector('.like');
    likesEl.addEventListener('click', () => {
        const likeElement = document.querySelector('.like');
        const photoId = image.id;
        const url = image.urls.regular;
        const des = image.alt_description;

        if (!includesPhotoId(photoId)) {
            likeElement.innerHTML = `<div class="like">${iconLikeChoose} ${likesCounter + 1}</div>`;
            saveLikesPhoto(photoId) 
            createPhotoHistoryEl(photoId, url, des)
        } else {
            likeElement.innerHTML = `<div class="like">${iconLike} ${likesCounter}</div>`;
            removeLikeLS(photoId);
            removePhotoHistoryEl(photoId);
        }
    });
}

function getHistoryTitle() {
    const historyEl = document.createElement('div');
    historyEl.classList.add('history');
    historyEl.innerHTML = '<h2 class="history-title">Сохраненные изображения</h2>';
    imageContEl.append(historyEl);
    const historyBoxEl = document.createElement('div');
    historyBoxEl.classList.add('history-box');
    historyEl.append(historyBoxEl);
}

async function processArray(array) {
    for (const item of array) {
      await getPhotoEl(item);
    }
    const historyBoxEl = document.querySelector('.history-box');
    historyBoxEl.addEventListener('click', async ({target}) => {
        const photoEl = target;
        const photoId = photoEl.dataset.id;
        loadPhoto(photoId);
    });
  }

async function getPhotoEl(photoId) {
    try {
        const photo = await getImages(photoId);
        createPhotoHistoryEl(photo.id, photo.urls.regular, photo.alt_description);
    } catch (error) {
        console.log(error);
    }
}

function createPhotoHistoryEl(phototId, urls, descripton) {
    const historyBoxEl = document.querySelector('.history-box');
        historyBoxEl.insertAdjacentHTML('beforeend', `<img class="history-photo" data-id="${phototId}" src="${urls}" alt="${descripton}"></img>` )
}

function removePhotoHistoryEl(photoId) {
    const removeEl = document.querySelector(`[data-id="${photoId}"]`);
    console.log(removeEl + 'remove');
    removeEl.remove();
}

function fillPhotoBottom(author, icon, likesCounter) {
    imageContEl.insertAdjacentHTML('beforeend', `<div class="bottom-photo"><h3 class="author">${author}</h3><div class="like">${icon} ${likesCounter}</div></div>`) 
}



