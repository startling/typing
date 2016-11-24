/* TODO make sure there's a cookie. */
exports.handler = function (event, context, callback) {
    callback(null, { "response"
		     : JSON.stringify(
			 { "phrases"
			 : ["abc", "def"]})});
}
