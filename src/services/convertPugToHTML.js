const pug = require('pug');

module.exports = async (filename, paramsObj) => {
	const compiledFunction = await pug.compileFile(`./src/views/${filename}`);
	const htmlText = compiledFunction({
		name: paramsObj.name,
		token: paramsObj.token,
	});
	return htmlText;
};
