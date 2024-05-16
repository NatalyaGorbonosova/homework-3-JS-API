const likesKey = 'likes';

function setLS(info) {
    localStorage.setItem(likesKey, JSON.stringify(info))
}

function getLS() {
    const likesArray = JSON.parse(localStorage(likesKey));
    if (!likesArray) {
        return [];
    }
    return likesArray;
}

function findPhotoId(photoId) {
    likesArray = getLS();
    return likesArray.find((likesPhotoId) => {photoId === likesPhotoId})
}

export { getLS, setLS, findPhotoId };