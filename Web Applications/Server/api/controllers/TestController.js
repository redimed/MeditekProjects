_= require('underscore');
module.exports={
	test:function(req,res)
    {
        var a={
            name:'tan',
            address:'binh duong',
            age:'50'
        }
        var b={
            name:'trinh',
            address:'thuan an',
            school:'thu dau mot'
        }
        _.extendOwn(a,b);
        console.log(a);


        UserAccount.findOne({
            where:{ID:1}
        })
        .then(function(user){
            console.log(user.dataValues);
        })


        res.status(200).json({status:'success',message:'kiem tra co token nen vao duoc',user:req.user});
    },

    testAdmin:function(req,res)
    {
        res.status(200).json({status:'success',message:'Ket qua kiem tra user chinh la admin',user:req.user});
    },

    testAssistant:function(req,res)
    {
        res.status(200).json({status:'success',message:'Ket qua kiem tra user la assistant',user:req.user});
    },

    testGp:function(req,res)
    {
        res.status(200).json({status:'success',message:'Ket qua kiem tra user chinh la gp',user:req.user});
    },

    testDoctor:function(req,res)
    {
        res.status(200).json({status:'success',message:'Ket qua kiem tra user chinh la Doctor',user:req.user});
    },

    testPatient:function(req,res)
    {
        res.status(200).json({status:'success',message:'Ket qua kiem tra user chinh la Patient',user:req.user});
    },



}