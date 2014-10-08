module.exports = angular
	.module('torrents')
	.controller('TorrentsCtrl', function(njrtLog, Torrents, $modal) {
		
		var logger = njrtLog.getInstance('torrents.TorrentsCtrl');
		
		logger.debug('TorrentsCtrl loaded.');

		var vm = this;

		vm.Torrents = Torrents;

		vm.predicate = 'name';
		vm.reverse = false;
		vm.status = '';

		vm.deleteData = function (torrent) {
			var modalInstance = $modal.open({
				templateUrl: 'torrents/torrents-delete-data.tpl.html',
				controller: function ($scope, torrent, $modalInstance, Torrents) {
					$scope.torrent = torrent;
					
					$scope.deleteData = function (hash) {
						Torrents.deleteData(hash).then(function(data) {
							$modalInstance.close(data);
						}, function(err) {
							console.log(err);
							logger.error(err);
						});

						// show error in gui somehow
					}

					$scope.cancel = function () {
						$modalInstance.dismiss('cancel');
					}
				},
				resolve: {
					torrent: function () {
						return torrent;
					}
				}
			});
		}
	});