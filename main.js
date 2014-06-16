function viewModel() {

	var self = this;
	self.jobs = ko.observableArray();
	self.displayedItem = ko.observable();
	self.search = ko.observable("");
	var jobs = [];

	$.get(
		'http://jkljobs.herokuapp.com/api/v1/jobs',
		function(data) {
			//console.log(data);
			data.sort(function(a, b) {
				if(a.added > b.added) return -1;
				if(a.added < b.added) return 1;
				else return 0;
			});
			jobs = data;
			ko.mapping.fromJS(data, {}, self.jobs);
			self.showItem(0);
		}
	);

	self.isSelected = function(id) {
		if(typeof self.displayedItem() !== "undefined") {
			if(typeof self.displayedItem()._id() !== "undefined") {			
				if(id == self.displayedItem()._id()) {
					return true;
				}
			}
		}
	}

	self.showItem = function(idx) {
		self.displayedItem(self.jobs()[idx]);
	}

	self.searchJobs = ko.computed(function() {
		var search = self.search().trim().split(" ");

		var filt = jobs.filter(function(item) {
			for (var i = 0; i < search.length; i++) {
				var itemdata = item.title.toLowerCase() + " " + item.company.toLowerCase();
				if (_.contains(itemdata, search[i].toLowerCase()))
					return item;
			}
		});	

		/*self.jobs([]);
		self.jobs.push.apply(self.jobs, filt);*/

		ko.mapping.fromJS(filt, {}, self.jobs);

	}).extend({ rateLimit: { method: "notifyWhenChangesStop", timeout: 250 }});

}

$(document).ready(function() {
	window.vm = new viewModel();
	ko.applyBindings(vm, document.getElementById("main"));
});