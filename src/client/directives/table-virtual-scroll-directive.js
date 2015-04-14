function TableVirtualScrollManager() {
  var TableVirtualScroll = {};

  TableVirtualScroll.deleteRow = function () {

  };

  return TableVirtualScroll;
}

function tableVirtualScroll() {

  var ROW_HEIGHT = 46;
  var MAX_ROW_MULTIPLIER = 3;
  var MIN_ROW_MULTIPLIER = 2;

  function controller() {

    var vm = this;

    vm.params = {
      skip: 0,
      limit: 100,
      sortBy: 'name',
      reverse: false,
      filter: null
    };

    function renderRows(data) {
      vm.tableVirtualScrollOptions.dataSource = {
        data: data.data,
        totalSize: data.total,
        totalLoaded: data.data.length
      };

      vm.render();
      vm.resetScroll();

      vm.params.skip = vm.params.skip + vm.params.limit;
      console.log(vm.tableVirtualScrollOptions.dataSource.data);
    }

    // conducting a sort resets the table and caching
    vm.sort = function (sortBy) {
      vm.params.sortBy = sortBy;
      vm.params.reverse = !vm.params.reverse;
      vm.params.skip = 0;

      vm.tableVirtualScrollOptions
        .getData(vm.params)
        .then(renderRows);
    };

    vm.tableVirtualScrollOptions.filter = function (filter) {
      vm.params.filter = filter;
      vm.params.skip = 0;

      vm.tableVirtualScrollOptions
        .getData(vm.params)
        .then(renderRows);
    };

    vm.tableVirtualScrollOptions.refreshRows = function (refreshRows, callback) {
      if (!refreshRows) {
        return;
      }

      vm.params.skip = 0;

      vm.tableVirtualScrollOptions
        .getData(vm.params)
        .then(renderRows);

      if (callback) {
        callback();
      }
    };

    vm.isSortAscDesc = function (sortBy) {
      if (vm.params.sortBy === sortBy ) {
        if (!vm.params.reverse) {
          return 'fa-caret-up';
        }

        return 'fa-caret-down';
      }
    };

    vm.tableVirtualScrollOptions.inViewHashes = [];

    vm.rowInView = function (inView, id) {
      var index = vm.tableVirtualScrollOptions.inViewHashes.indexOf(id);
      if (index > -1) {
        if (inView) {
          return;
        }
        vm.tableVirtualScrollOptions.inViewHashes.splice(index, 1);
      } else {
        if (inView) {
          vm.tableVirtualScrollOptions.inViewHashes.push(id);
        } else {
          return;
        }
      }
    };

    vm.tableVirtualScrollOptions.deleteRows = function (hashes) {
      for (var i = hashes.length - 1; i >= 0; i--) {
        var hash = hashes[i];
        console.log('deleting hash', hash);

        var index = _.findIndex(vm.tableVirtualScrollOptions.dataSource.data, {
          hash: hash
        });

        // concat arrays in order of main, top, bottom
        // if index is in the range of main, top, or bottom, then the
        // item is in that array. when found, slice it out
        if (index > -1) {
          console.log('delete index', index);
          vm.tableVirtualScrollOptions.dataSource.data.splice(index, 1);
        }

        vm.render();
      }
    };

  }

  function link(scope, elem, attrs, ctrl) {


    var V_BOTTOM_PADDING_CLASSNAME = '.table-virtual-bottom';
    var V_TOP_PADDING_CLASSNAME = '.table-virtual-top';

    var scrollingContainer = elem.parent();

    var tbody = elem.find('tbody');

    tbody.prepend('<tr class="table-virtual-top"></tr>');
    tbody.append('<tr class="table-virtual-bottom"></tr>');

    var vBottomPaddingElem = elem.find(V_BOTTOM_PADDING_CLASSNAME);
    var vTopPaddingElem = elem.find(V_TOP_PADDING_CLASSNAME);

    var ticking = false;
    var loading = false;

    ctrl.params.skip = ctrl.tableVirtualScrollOptions.dataSource.totalLoaded;

    ctrl.scrollingContainerHeight = document.getElementsByTagName('html')[0].offsetHeight; // default

    // scroll top initial is 0
    ctrl.currentSt = 0;

    ctrl.render = function () {
      calculateIndex();
      renderRows(ctrl.rowBegin, ctrl.rowEnd);
    };

    ctrl.resetScroll = function () {
      scrollingContainer.scrollTop(0);
    };

    function getData() {
      // do check to load data else proceed
      // if beginning, do not process since it will duplicate call
      if (ctrl.rowBegin !== 0 && !loading && ctrl.tableVirtualScrollOptions.dataSource.totalLoaded < ctrl.tableVirtualScrollOptions.dataSource.totalSize) {
         console.log('not loading and total loaded is less than total size');
        if (ctrl.rowEnd > ctrl.tableVirtualScrollOptions.dataSource.totalLoaded - 20) {
          console.log('row end is within threshold of', ctrl.tableVirtualScrollOptions.dataSource.totalLoaded - 20);
          loading = true;
          console.log(ctrl.params);
          ctrl.tableVirtualScrollOptions
              .getData(ctrl.params)
              .then(function (data) {
                ctrl.params.skip = ctrl.params.skip + ctrl.params.limit;
                ctrl.tableVirtualScrollOptions.dataSource.data = ctrl.tableVirtualScrollOptions.dataSource.data.concat(data.data);
                ctrl.tableVirtualScrollOptions.dataSource.totalLoaded = ctrl.tableVirtualScrollOptions.dataSource.totalLoaded + data.data.length;
                loading = false;
                // call renderRows when finished
                renderRows(ctrl.rowBegin, ctrl.rowEnd);
              });
        }
      }
    }

    function calculateIndex() {
      var totalSize = ctrl.tableVirtualScrollOptions.dataSource.totalSize - 1;
      var minHeight = ctrl.scrollingContainerHeight * MIN_ROW_MULTIPLIER;
      var maxHeight = ctrl.scrollingContainerHeight * MAX_ROW_MULTIPLIER;


      // if end exceeds total size set row end to total size
      ctrl.rowEnd = Math.floor((minHeight + ctrl.currentSt) / ROW_HEIGHT);
      if (ctrl.rowEnd > totalSize) {
        ctrl.rowEnd = totalSize;
      }

      // if end exceeds max container size in rows
      // set row begin to
      if (ctrl.rowEnd > Math.floor(maxHeight / ROW_HEIGHT)) {
        ctrl.rowBegin = Math.floor((ctrl.currentSt - ctrl.scrollingContainerHeight) / ROW_HEIGHT);
      } else {
        ctrl.rowBegin = 0;
      }

      if (ctrl.rowBegin < 0) {
        ctrl.rowBegin = 0;
      }
    }

    function renderRows(beginIndex, endIndex) {

      if (!loading) {
        ctrl.tableVirtualScrollOptions.dataSource.displayData = ctrl.tableVirtualScrollOptions.dataSource.data.slice(beginIndex, endIndex + 1);

        // console.log(beginIndex, endIndex);

        vBottomPaddingElem[0].style.height = (ctrl.tableVirtualScrollOptions.dataSource.totalSize - endIndex - 1) * ROW_HEIGHT + 'px';
        vTopPaddingElem[0].style.height = (beginIndex * ROW_HEIGHT) + 'px';
      }

    }

    function tableScroll() {
      ticking = false;
      calculateIndex();
      getData();
      renderRows(ctrl.rowBegin, ctrl.rowEnd);

      scope.$digest();
    }

    function requestTick() {
      if (!ticking) {
        requestAnimationFrame(tableScroll);
        ticking = true;
      }

    }

    // container scroll
    scrollingContainer.bind('scroll', function () {
      ctrl.currentSt = scrollingContainer[0].scrollTop;
      requestTick();
    });

    // container resize
    scope.$watch(function() {
      return scrollingContainer[0].offsetHeight;
    }, function(newValue) {
      ctrl.scrollingContainerHeight = newValue - 31;
      calculateIndex();
      renderRows(ctrl.rowBegin, ctrl.rowEnd);
    });

    // setup floatThead
    elem.floatThead({
      useAbsolutePositioning: true,
      zIndex: 999,
      scrollContainer: function () {
        return scrollingContainer;
      }
    });

    // timeout to trigger reflow
    setTimeout(function() {
      elem.floatThead('reflow');
    }, 200);

    ctrl.render();

  }

	return {
		restrict: 'A',
    scope: {
      tableVirtualScrollOptions: '='
    },
		link: link,
    controller: controller,
    controllerAs: 'tableVirtualScrollCtrl',
    bindToController: true,
    templateUrl: 'directives/table-virtual-scroll.tpl.html'
	};
}

angular
	.module('app')
	.directive('tableVirtualScroll', [tableVirtualScroll])
  .factory('TableVirtualScrollManager', TableVirtualScrollManager);
