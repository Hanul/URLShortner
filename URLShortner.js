require(process.env.UPPERCASE_PATH + '/BOOT.js');

BOOT({
	
	CONFIG : {
		isDevMode : true,
		defaultBoxName : 'URLShortner',
		webServerPort : 8627,
		
		URLShortner : {
			domain : 'http://catworld.link'
		}
	},
	
	NODE_CONFIG : {
		dbName : 'CatWorldLink'
	}
});
