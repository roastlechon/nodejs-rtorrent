module.exports = angular
	.module('modal', [
		'ui.bootstrap',
		'ui.router',
		'ct.ui.router.extras'
	])
	.run(function($rootScope, $modal, $previousState) {

		var stateBehindModal = {};
		var modalInstance = null;

		$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

			// Implementing 'isModal':
			// perform the required action to transitions between 'modal states' and 'non-modal states'.
			//

			if (!fromState.isModal && toState.isModal) {
				//
				// Non-modal state ---> modal state
				//

				stateBehindModal = {
					state: fromState,
					params: fromParams
				};

				$previousState.memo('modalInvoker');

				// Open up modal
				modalInstance = $modal.open({
					template: '<div ui-view="modal"></div>',
					backdrop: 'static'
				});

				modalInstance.result.finally(function() {
					// Reset instance to mark that the modal has been dismissed.
					modalInstance = null

					// Go to previous state
					$state.go(stateBehindModal.state, stateBehindModal.params);
				});

			} else if (fromState.isModal && !toState.isModal) {
				//
				// Modal state ---> non-modal state
				//

				// Directly return if the instance is already dismissed.
				if (!modalInstance) {
					return;
				}

				// Dismiss the modal, triggering the reset of modalInstance
				modalInstance.dismiss();
			}

		});
	});