function adminOnly(req, res, next) {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(req.user ? 403 : 401).json({
            success: false,
            message: req.user ? 'Admin access required' : 'Not authorized'
        })
    }
    next()
}

module.exports = adminOnly