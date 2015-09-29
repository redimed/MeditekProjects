module.exports = function(req, res, next) {
   if (req.user.role=='gp') {
        return next();
    }
    else{
        return res.redirect('/login');
    }
};
