var enabled = false; // A flag to know when start or stop the camera
var WebCamera = require("webcamjs"); // Use require to add webcamjs
var remote = require('electron').remote; // Load remote component that contains the dialog dependency
var fs = require('fs'); // Load the File System to execute our common tasks (CRUD)
/*var AWS = require('aws-sdk');
var rekognition = new AWS.Rekognition({
    accessKeyId: "AKIAIVC3SUTYMGMZKOGQ",
    secretAccessKey: "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",
    region: "ap-northeast-1"
});*/

function webcamStart() {
    if (!enabled) { // Start the camera !
        enabled = true;
        WebCamera.attach('#camdemo');
        console.log("The camera has been started");
    } else { // Disable the camera !
        enabled = false;
        WebCamera.reset();
        console.log("The camera has been disabled");
    }
};
webcamStart();

function savephoto() {
    console.log("Save button clicked");
    if (enabled) {
        WebCamera.snap(function (data_uri) {
            var now = new Date();
            var fileName = __dirname+'/UserFaces/' + now.getFullYear() + now.getMonth() + now.getDate() + "_" + now.getHours() + now.getMinutes() + now.getSeconds() + '.png';
            console.log(fileName);

            var imageBuffer = processBase64Image(data_uri);

            try {
                fs.mkdirSync('UserFaces');
            } catch (e) {
                if (e.code != 'EEXIST') throw e; // 존재할경우 패스처리함. 
            }

            fs.writeFile(fileName, imageBuffer.data, function (err) {
                if (err) {
                    console.log("Cannot save the file :'( time to cry !");
                } else {
                    console.log("Image saved succesfully");
                    document.getElementById("preview").setAttribute("src", fileName);

                    /*var params6 = {
                        "CollectionId": "zele-rekog",
                        "FaceMatchThreshold": 70,
                        "Image": {
                            "Bytes": imageBuffer.data,
                        },
                        "MaxFaces": 1
                    };

                    rekognition.searchFacesByImage(params6, function (err, data) {
                        if (err) console.log(err, err.stack);
                        else console.log(data);
                    });*/

                }
            });

        });
    } else {
        console.log("Please enable the camera first to take the snapshot !");
    }
}

// return an object with the processed base64image
function processBase64Image(dataString) {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
        response = {};

    if (matches.length !== 3) {
        return new Error('Invalid input string');
    }

    response.type = matches[1];
    response.data = new Buffer(matches[2], 'base64');

    return response;
}