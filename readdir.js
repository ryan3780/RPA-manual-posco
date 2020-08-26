var testFolder = "./htmlFiles/";
var fs = require('fs');
var jsonfile = require('jsonfile');

fs.readdir(testFolder, function (error, filelist) {
    // console.log(filelist);
    var objArr = [];
    var dataObj = new Object();
    filelist.forEach((file, idx) => {
        var obj = new Object();
        var removeSpace = file.replace(/(\s*)/g, "");
        obj.name = removeSpace;
        obj.number = idx;
        objArr.push(obj);
    });
    // console.log(objArr);
    dataObj = objArr;

    var dataObj_s = JSON.stringify(dataObj, null, "\t");
    console.log(dataObj_s);

    jsonfile.writeFile('filename.json', dataObj_s);
})