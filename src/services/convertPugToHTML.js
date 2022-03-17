const pug = require('pug');

module.exports = async (filename, paramsObj) => {
	const compiledFunction = await pug.compileFile(`./src/views/${filename}`);
	let htmlText = compiledFunction({
		name: paramsObj.name,
		id: paramsObj.id,
	});
	return htmlText;
};
