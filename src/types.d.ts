type ErrorBoundaryProps = {
  errorMessage?: Function,
  fallbackUI?: Function
};

type ErrorBoundaryState = {
  treeHasError: boolean,
  treeError: {
    error: boolean | string,
    info: string
  }
};

type FloodgateProps = {
  children: (args: {
    items: Array<any>,
    loadComplete: boolean,
    loadAll: Function,
    loadNext: Function,
    reset: Function,
    exportState: Function
  }) => JSX.Element,
  data: any[],
  increment: number,
  initial: number,
  exportStateOnUnmount?: boolean,
  onExportState?: Function,
  onLoadNext?: Function,
  onLoadComplete?: Function,
  onReset?: Function
};

type FloodgateState = {
  items: any[],
  renderedItems: any[],
  allItemsRendered: boolean,
  currentIndex?: number,
  prevProps: {
    data: FloodgateProps['data'],
    increment: FloodgateProps['increment'],
    initial: FloodgateProps['initial']
  }
};

export {
  ErrorBoundaryProps,
  ErrorBoundaryState,
  FloodgateProps,
  FloodgateState
};
