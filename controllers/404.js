exports.notFound = (req,res,next,path='')=>{
    res.status(404).render('404', {docTitle: 'Page Not Found', path: '/'});
};