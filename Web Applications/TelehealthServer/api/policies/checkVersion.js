var apiVersions=require("./apiVersions/apiVersions");
var ErrorWrap=require("../services/ErrorWrap");
module.exports = function(req, res, next) {
    console.log("=============CHECK API VERSION=====================");
    var method=req.method.toLowerCase();
    var apiOriginal=method+" "+req.options.detectedVerb.original;
    var api=method+" "+req.path;
    var version=req.headers.version;
    console.log("=====api original:"+apiOriginal);
    console.log("=====api:"+api);
    console.log("=====version checking:"+version);
    if(version)
    {
        //Kiểm tra version client truyền lên đã được định nghĩa hay chưa
        if(apiVersions[apiOriginal] && apiVersions[apiOriginal][version])
        {
            //Kiểm tra version còn enable hay không
            if(apiVersions[apiOriginal][version].enable)
            {
                //Version còn enable thì chạy action tương ứng version đó
                console.log("=====Version Enable->Execute Action");
                apiVersions[apiOriginal][version].action(req,res);
            }
            else
            {
                //nếu version không còn enable thì trả về lỗi 301 outOfDate
                console.log("=====Error:Version.outOfDate==>301 http status movedPermanently");
                var err=new Error("Version.outOfDate");
                res.movedPermanently(ErrorWrap(err));
            }
        }
        else
        {
            //Nếu version client truyền đến không xác định thì trả về lỗi 400 badRequest
            console.log("=====Error:Version.invalid==>400 http status badRequest")
            var err=new Error("Version.invalid");
            res.badRequest(ErrorWrap(err));
        }
    }
    else
    {
        //Mặc định nếu client gọi api không truyền theo version
        //thì sẽ thực thi Action quy định trong routes.js (Action của version mới nhất)
        console.log("=====GO TO NEWEST VERSION API");
        next();
    }

    
};
