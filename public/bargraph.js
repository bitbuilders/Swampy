
console.log(posts);

var ctx;
window.onload = function() {
    var c = document.getElementById("barCanvas");
    var ctx = c.getContext("2d");

    var userImages = [];
    var userNum = posts.length;
    var xGrowth = c.width / (userNum + 1);
    var imgWidth = 25;
    var imgHeight = 25;
    var imgHalf = imgWidth / 2;
    var x = xGrowth;
    var y = c.height - imgHeight;

    var maxPosts = 20;
    var maxHeight = c.height - imgHeight * 2.75;
    var p = 0;

    for (var i = 0; i < userNum; i++) {
        var img = new Image();
        img.onload = function() {
            if (p >= userNum)
                return;
            
            var numPosts = posts[p].count;
            var xPos = x - imgHalf;
            var yPos = y - imgHalf;
            img.src = posts[p].imageURL;
            p++;
            ctx.drawImage(img, xPos, yPos, imgWidth, imgHeight);

            var bL = { x: xPos, y: yPos - 5 };
            var tL = { x: xPos, y: (yPos - imgHalf) - (numPosts / maxPosts) * maxHeight };
            var tR = { x: xPos + imgWidth, y: tL.y };
            var bR = { x: tR.x, y: bL.y };
            var r = Math.floor(Math.random() * (100)) + 156;
            var g = Math.floor(Math.random() * (100)) + 156;
            var b = Math.floor(Math.random() * (100)) + 156;
            ctx.fillStyle = 'rgb(' + 100 + ',' + g + ',' + b + ')';
            ctx.fillRect(tL.x, tL.y, tR.x - tL.x, bR.y - tR.y);
            x += xGrowth;
        };
        img.src = posts[i].imageURL;
        userImages.push(img);
    }

}