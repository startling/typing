/* generate a cookie, return nothing, 200. */
exports.handler = function (event, context, callback) {
    var expires = new Date();
    var httpsOnly = "";
    if (!process.env.HTTP) {
	httpsOnly = "; HttpsOnly"
    }
    /* TODO: only do it if no cookie is set */
    callback(null, {"cookie"
		    : "userid=" + Math.random()
		    + "; Domain=" + process.env.DOMAIN
		    + "; Max-Age=" + 365 * 24 * 60 * 60 * 1000
		    + httpsOnly
		    + ";"});
}
