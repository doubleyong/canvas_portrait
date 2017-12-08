/**
 *
 */
var express = require("express");
var fs = require("fs");
var path = require('path');
var app = express();
var multipart = require('connect-multiparty');  //实现文件上传

app.configure(function(){
    //app.use(express.bodyParser());
    //指定临时存储的路径
    app.use(express.bodyParser({uploadDir:'./public/temp'}));
    app.use(express.methodOverride());
    app.use(express.static(__dirname+"/public"));
});

//上传头像文件
app.post("/uploadImage.do",multipart(),function(req,res){

        //得到文件名
        var filename = req.files.txtFile.originalFilename || path.basename(req.files.txtFile.ws.path);

        //目标文件的目录
        var targetPath = path.dirname(__filename) + '/public/image/' + filename;
         //复制文件
        fs.createReadStream(req.files.txtFile.ws.path).pipe(fs.createWriteStream(targetPath));

        //返回返回的路径
        res.json({code: 200, msg: {url: 'image/' + filename}});
});


//将裁剪后的base64格式文件，保存为图片的POST方法
app.post('/upload', function(req, res){
    //接收前台POST过来的base64
    var imgData = req.body.imgData;
    console.log(imgData);
    //过滤data:image/png;base64,
    var base64Data = imgData.replace(/data:image\/png;base64,/, "").replace(/\s/g,"+");
    //使用express接收POST值后，base64编码字符串中的“+”号被替换成空格了，
    // 引起编码出错，img.src = base64Data;直接把nodejs服务挂掉。
    //.replace(/\s/g,"+") 就是把空格还原成+号
    var dataBuffer = new Buffer(base64Data, 'base64');
    console.log(base64Data);

    var filename = new Date().getTime()+"_small.png";//文件名,加入时间，避免文件名重复
    fs.writeFile("public/image/"+filename, dataBuffer, function(err) {
        if(err){
            res.send(err);
        }else{
            res.send("保存成功！");
        }
    });
});
app.listen("9999");