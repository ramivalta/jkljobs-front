function viewModel() {

	var self = this;
	self.jobs = ko.observableArray();
	self.displayedItem = ko.observable();

	$.get(
		'http://jkljobs.herokuapp.com/api/v1/jobs',
		function(data) {
			//console.log(data);
			data.sort(function(a, b) {
				if(a.added > b.added) return -1;
				if(a.added < b.added) return 1;
				else return 0;
			});
			ko.mapping.fromJS(data, {}, self.jobs);
			self.showItem(null, 0);
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

}

$(document).ready(function() {
	window.vm = new viewModel();
	ko.applyBindings(vm, document.getElementById("main"));
});