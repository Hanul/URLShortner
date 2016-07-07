OVERRIDE(URLShortner.LinkModel, function(origin) {
	'use strict';
	
	URLShortner.LinkModel = OBJECT({

		preset : function() {
			return origin;
		},

		init : function(inner, self, params) {
			
			inner.on('create', {

				before : function(data, next, ret) {
					
					var
					// url
					url = data.url,
					
					// i
					i = 0,
					
					// f.
					f = function() {

						var
						// id
						id;
						
						// 최대 백번만 실행
						if (i < 100) {
							i += 1;
							
							id = RANDOM_STR(6);
							
							self.checkIsExists({
								filter : {
									id : id
								}
							}, function(isExists) {
								
								// 이미 있으면 다시 생성
								if (isExists === true) {
									f();
								} else {
									data.id = id;
									next();
								}
							});
						}
					};
					
					// http나 https가 안붙어 있으면 붙혀줍니다.
					if (url.substring(0, 7) !== 'http://' && url.substring(0, 8) !== 'https://') {
						data.url = url = 'http://' + url;
					}
					
					// 해당 URL이 이미 등록되어 있으면 그것을 반환합니다.
					self.get({
						filter : {
							url : url
						}
					}, {
						success : function(savedData) {
							ret({
								savedData : savedData
							});
						},
						
						// 등록되어 있지 않다면 새로 등록합니다.
						notExists : function() {
							
							// 현재 서비스의 도메인과 달라야합니다.
							if (url.substring(0, CONFIG.URLShortner.domain.length) !== CONFIG.URLShortner.domain) {
								
								// URL을 등록합니다.
								f();
							}
						}
					});

					return false;
				}
			});
		}
	});
});
