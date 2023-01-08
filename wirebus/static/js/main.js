var fakeServer = new FakeServer();

const columnDefs = [
  // keys
  { field: 'productName', rowGroup: true, hide: true },
  { field: 'portfolioName', rowGroup: true, hide: true },
  { field: 'bookId', rowGroup: true, hide: true },

  // {field: 'productId'},
  // {field: 'portfolioId'},
  // {field: 'bookId'},

  // all the other columns (visible and not grouped)
  {
    headerName: 'Binance[USD]',
    field: 'current',
    width: 200,
    type: 'numericColumn',
    valueFormatter: numberCellFormatter,
    cellRenderer: 'agAnimateShowChangeCellRenderer',
  },
  {
    headerName: 'Binance[KRW]',
    field: 'previous',
    width: 200,
    type: 'numericColumn',
    valueFormatter: numberCellFormatter,
    cellRenderer: 'agAnimateShowChangeCellRenderer',
  },
  {
    headerName: 'Upbit[USD]',
    field: 'current',
    width: 200,
    type: 'numericColumn',
    valueFormatter: numberCellFormatter,
    cellRenderer: 'agAnimateShowChangeCellRenderer',
  },
  {
    headerName: 'Upbit[KRW]',
    field: 'previous',
    width: 200,
    type: 'numericColumn',
    valueFormatter: numberCellFormatter,
    cellRenderer: 'agAnimateShowChangeCellRenderer',
  },
  {
    headerName: 'K-Premium[%]',
    field: 'pl1',
    width: 200,
    type: 'numericColumn',
    valueFormatter: numberCellFormatter,
    cellRenderer: 'agAnimateShowChangeCellRenderer',
  },
];

const gridOptions = {
  asyncTransactionWaitMillis: 500,
  purgeClosedRowNodes: true,
  rowSelection: 'multiple',
  columnDefs: columnDefs,
  rowModelType: 'serverSide',
  animateRows: true,
  defaultColDef: {
    width: 250,
    resizable: true,
    sortable: true,
  },
  autoGroupColumnDef: {
    field: 'tradeId',
  },
  getRowId: getRowId,
  isApplyServerSideTransaction: isApplyServerSideTransaction,
  onAsyncTransactionsFlushed: onAsyncTransactionsFlushed,
  onGridReady: (params) => {
    var dataSource = {
      getRows: (params2) => {
        fakeServer.getData(
          params2.request,
          params2.parentNode.data,
          function (result, serverVersion) {
            params2.success({
              rowData: result,
              groupLevelInfo: { serverVersion: serverVersion },
            });
          }
        );
      },
    };

    params.api.setServerSideDatasource(dataSource);

    var callback = processUpdateFromFakeServer.bind(window, params.api);

    fakeServer.addUpdateListener(callback);
  },
};

function getRowId(params) {
  var data = params.data;
  if (data.tradeId) {
    return data.tradeId;
  } else if (data.bookId) {
    return data.bookId;
  } else if (data.portfolioId) {
    return data.portfolioId;
  } else if (data.productId) {
    return data.productId;
  }
}

function isApplyServerSideTransaction(params) {
  var transactionVersion = params.transaction.serverVersion;
  var dataLoadedVersion = params.groupLevelInfo.serverVersion;
  var transactionCreatedSinceInitialLoad =
    transactionVersion > dataLoadedVersion;
  if (!transactionCreatedSinceInitialLoad) {
    console.log('cancelling transaction');
  }
  return transactionCreatedSinceInitialLoad;
}

function onAsyncTransactionsFlushed(e) {
  var summary = {};
  e.results.forEach((result) => {
    var status = result.status;
    if (summary[status] == null) {
      summary[status] = 0;
    }
    summary[status]++;
  });
  console.log('onAsyncTransactionsFlushed: ' + JSON.stringify(summary));
}

function numberCellFormatter(params) {
  return Math.floor(params.value)
    .toString()
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

function onBtStart() {
  fakeServer.startUpdates();
}

function onBtStop() {
  fakeServer.stopUpdates();
}

function onBtApplyOneTransaction() {
  fakeServer.insertOneRecord();
}

function processUpdateFromFakeServer(gridApi, transactions) {
  var updatingJustOneTransaction = transactions.length == 4;
  if (updatingJustOneTransaction) {
    console.log('Updating One Record');
  }
  transactions.forEach(function (tx) {
    gridApi.applyServerSideTransactionAsync(tx, function (res) {
      if (updatingJustOneTransaction) {
        console.log(
          'Route [' + (tx.route || []).join(',') + '], status = ' + res.status
        );
      }
    });
  });
}

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function () {
  var gridDiv = document.querySelector('#myGrid');
  new agGrid.Grid(gridDiv, gridOptions);
});
