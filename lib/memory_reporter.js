
const {Cc, Ci, Cu} = require("chrome");

 //import AddonManager
const AddonManager = Cu.import("resource://gre/modules/AddonManager.jsm").AddonManager;
const types =['extension'];

exports.getAllMemoryUsage = function(callback) {
	AddonManager.getAddonsByTypes(types, function(addons) {
		var addonData = [];

		for (let i in addons) {
			let cur = addons[i];
			let n = getMemoryUsageById(cur.id.toString());
			addonData.push({
				id: cur.id.toString(),
				name: cur.name,
				mem: n
			});
		};

		callback(addonData);
	});
};

exports.getAddonMemoryInfo = function(id, callback) {
	AddonManager.getAddonByID(id, function(addon) {
		let n = getMemoryUsageById(addon.id.toString());
		let addonData = {
			id: addon.id.toString(),
			name: addon.name,
			mem: n
		};
		callback(addonData);
	});
};

var pp = function(o) {
	return JSON.stringify(o, null, '    ');
}

/*
 * from here: http://adblockplus.org/blog/measuring-the-memory-use-of-an-sdk-jetpack-based-add-on
 */
function getMemoryUsageById(id) {
	let prefix = "resource://"+ id +"-";
	let mgr = Cc["@mozilla.org/memory-reporter-manager;1"]
	                    .getService(Ci.nsIMemoryReporterManager);
	
	let e = mgr.enumerateMultiReporters();
	let n = 0;
	console.log("got here, "+id);
	while (e.hasMoreElements()) {
	  let reporter = e.getNext().QueryInterface(Ci.nsIMemoryMultiReporter);

	  reporter.collectReports(function(process, path, kind, units, amount, description) {

	    if (path.indexOf(prefix.replace(/\//g, "\\")) >= 0)
	    	console.log(path);
      		n += amount;

	  }, null);
	}
	return (n / 1024);
};
