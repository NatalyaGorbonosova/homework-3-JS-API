const likesKey = 'likes';

function setLS(info) {
    localStorage.setItem(likesKey, JSON.stringify(info))
}

function getLS() {
    const likesArray = JSON.parse(localStorage.getItem(likesKey));
    
    if (likesArray === null) {
        return [];
    }
    return likesArray;
}

function savePhotoIdLS(photoId) {
    const likesArray = getLS();
    likesArray.push(photoId);
    setLS(likesArray);
}

function includesPhotoId(photoId) {
    const likesArray = getLS();
    return likesArray.includes(photoId);
}

function findPhotoId(photoId) {
    const likesArray = getLS();
    return likesArray.find((likesPhotoId) => photoId === likesPhotoId)
}

function removeLikeLS(photoId) {
    const likesArray = getLS();
    if (includesPhotoId(photoId)) {
        const dislikePhotoId = findPhotoId(photoId);
        likesArray.splice(likesArray.indexOf(dislikePhotoId), 1);
        setLS(likesArray);
    }
}
function saveLikesPhoto(photoId) {
    const likesArray = getLS();
    likesArray.push(photoId);
    setLS(likesArray);
}


export { setLS, getLS, savePhotoIdLS, includesPhotoId, findPhotoId, removeLikeLS, saveLikesPhoto };