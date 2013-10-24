define([
	"jquery",
	"underscore",
	"backbone",
	"text!templates/panes/torrents_pane.html",
	"views/TorrentsView",
	"collections/TorrentCollection"
], function($, _, Backbone, torrents_pane, TorrentsView, TorrentCollection) {
	var TorrentsPaneView = Backbone.View.extend({
		events: {
			"click .clear-filter": "clearFilter",
			"click .filter-status": "filterStatus",
			"click .toggle-column": "toggleColumn",
			"click th": "sortColumn"
		},
		initialize: function(options) {
			this.vent = options.vent;
		},
		render: function() {
			this.$el.html(torrents_pane);
			this.collection = new TorrentCollection();
			var app = new TorrentsView({
				vent: this.vent,
				el: $("#torrents table"),
				collection: this.collection
			});
		},
		filterStatus: function(event) {
			var status = $(event.currentTarget).data("status");
			this.collection.filterBy({"status": status});
			console.log(this.collection);
			console.log("filterby");
		},
		clearFilter: function(event) {
			this.collection.clearFilter();
		},
		toggleColumn: function(event) {
			if (!event.currentTarget.checked) {
				this.vent.trigger("hideColumn", event.currentTarget.value);
			} else {
				this.vent.trigger("showColumn", event.currentTarget.value);
			}
			this.$("[data-column=" + event.currentTarget.value + "]").toggle();
		},
		sortColumn: function(event) {
			var columnName = $(event.currentTarget).data("column");
			console.log("sorting " + columnName);
			this.collection.sortDirection = (this.collection.sortDirection == 1) ? -1 : 1;
			console.log("sort direction is " + this.collection.sortDirection);
			this.collection.sortColumn(columnName);

			$("#torrents table th i").hide();
			$(event.currentTarget).find("i").show();

			if (this.collection.sortDirection == 1) {
				$(event.currentTarget).toggleClass("dropup");
			} else {
				$(event.currentTarget).toggleClass("dropup");
			}
		}
	});
	return TorrentsPaneView;
});