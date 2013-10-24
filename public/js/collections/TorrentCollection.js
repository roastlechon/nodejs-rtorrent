define([
	"jquery",
	"underscore",
	"backbone",
	"models/TorrentModel"
], function($, _, Backbone, TorrentModel) {
	var TorrentCollection = Backbone.Collection.extend({
		model: TorrentModel,
		defaultSortColumn: "name",
		sortDirection: 1,
		initialize: function() {
			this.filtered = new Backbone.Collection(this);
			this.on("add", this.refilter);
			this.on("remove", this.refilter);
		},
		sortColumn: function(column) {
			this.defaultSortColumn = column;
			this.sort();
		},
		comparator: function(a, b) {
			var a = a.get(this.defaultSortColumn);
			var b = b.get(this.defaultSortColumn);

			if (a == b) {
				return 0;
			}

			if (this.sortDirection == 1) {
				return a > b ? 1 : -1;
			} else {
				return a < b ? 1 : -1;
			}
		},
		filterBy: function(params) {
			var filteredCollection = this.where(params);
			this.filtered.params = params;
			if (!params) {
				this.filtered.reset(this.models);
			} else {
				this.filtered.reset(filteredCollection);
			}
		},
		refilter: function() {
			this.filterBy(this.filtered.params);
		},
		clearFilter: function() {
			this.filtered.reset(this.models)
		}
	});
	return TorrentCollection;
});