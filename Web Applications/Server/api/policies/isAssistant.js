module.exports = function(req, res, next) {
   if (req.user.role=='assistant') {
        return next();
    }
    else{
        return res.redirect('/login');
    }
};
