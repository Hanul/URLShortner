URLShortner.MAIN = METHOD({

	run : function(addRequestListener) {
		'use strict';
		
		addRequestListener(function(requestInfo, response, onDisconnected, replaceRootPath, next) {

			var
			// uri
			uri = requestInfo.uri,
			
			// method
			method = requestInfo.method,
			
			// url to share
			urlToShare = requestInfo.params.url;
			
			if (method === 'POST') {
				
				URLShortner.LinkModel.get({
					filter : {
						url : urlToShare
					}
				}, {
					notExists : function() {
						URLShortner.LinkModel.create({
							url : urlToShare
						}, function(linkData) {
							response(CONFIG.URLShortner.domain + '/' + linkData.id);
						});
					},
					
					success : function(linkData) {
						response(CONFIG.URLShortner.domain + '/' + linkData.id);
					}
				});
				
				return false;
			}
			
			else {
				
				URLShortner.LinkModel.get(uri, {
					notExists : function() {
						next();
					},
					success : function(linkData) {
						
						URLShortner.LinkModel.update({
							id : linkData.id,
							$inc : {
								count : 1
							}
						});
						
						response({
							statusCode : 302,
							headers : {
								'Location' : linkData.url
							}
						});
					}
				});
				
				return false;
			}
		});
	}
});
