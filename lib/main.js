
const mr = require("memory_reporter.js");

mr.getAllMemoryUsage(function(ids) {
	console.log(JSON.stringify(ids, null, '  '));
});



