
const BASE_URL = 'https://api.adorable.io/avatars';
// const face;

console.log(face);
console.log(user);
// console.log(faceObj);
// console.log(users);

var currFace = {};
{
    let keys = Object.keys(face);
    for(var i = 0; i < keys.length; i++){
        currFace[keys[i]] = 0;
    }
}

function useDefaultAvatar(){
    var avatarCustBox = document.getElementById('AvatarCustomization');
    avatarCustBox.classList.add('hide');

    var imageInput = document.getElementById('imageInput');
    var profileImg = document.getElementById('profileImg');

    var src = BASE_URL + '/' + user.username + '.png';
    profileImg.src = src;
    imageInput.value = src;
}
function useCustomAvatar(){
    var avatarCustBox = document.getElementById('AvatarCustomization');

    avatarCustBox.classList.remove('hide');

    changeImage();
}

useDefaultAvatar();

function changeItem(name, amo){
    // console.log(currFace);
    // console.log(face);

    currFace[name] = currFace[name] + amo;

    if(currFace[name] >= face[name].length){
        currFace[name] = 0;
    }
    if(currFace[name] < 0){
        currFace[name] = face[name].length - 1;
    }

    var itemInput = document.getElementById(name + 'Input');
    itemInput.value = face[name][currFace[name]];

    changeImage();
}
function changeImage(){
    var profileImg = document.getElementById('profileImg');

    var src = BASE_URL + '/face';
    let keys = Object.keys(face);
    for(var i = 0; i < keys.length; i++){
        var index = currFace[keys[i]];
        src += '/' + face[keys[i]][index];
    }
    console.log(src);

    profileImg.src = src;

    var imageInput = document.getElementById('imageInput');
    imageInput.value = src;
}