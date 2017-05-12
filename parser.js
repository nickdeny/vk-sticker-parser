var https = require('https'),
    fs = require('fs');

console.log('//nickdeny');
var appRoot = process.env.PWD,
    uploadDir = 'parsed-data/'; //'.'+appRoot+"/nickdeny/stickers/";
console.log('[#] Parsing starting...');
var num = 0; // start from
setInterval(() => {
    console.log(`[#] File downloaded. (ID: ${num})`);
    getFile("https://vk.com/images/stickers/"+num+"/512.png", uploadDir+"sticker-"+num+".png");
    num++;
}, 100);

function getFile(url, path) {
    var http_or_https = https;
    //if (/^https:\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/.test(url)) {
    //    http_or_https = https;
    //}
    http_or_https.get(url, function(response) {
        var headers = JSON.stringify(response.headers);
        switch(response.statusCode) {
            case 200:
                var file = fs.createWriteStream(path);
                response.on('data', function(chunk){
                    file.write(chunk);
                }).on('end', function(){
                    file.end();
                    console.log(`[#] File saved. (${path})`);
                });
                break;
            case 301:
            case 302:
            case 303:
            case 307:
                getFile(response.headers.location, path);
                break;
            default:
                console.log('[x] Error - '+response.statusCode);
        }

    })
    .on('error', function(err) {
        console.log('[x] Error - '+path);
    });
}
