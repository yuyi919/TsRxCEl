export function computeWorker<Q, R>(computeCallback: Q, message: R): Promise<R> {
    const func: string = computeCallback.toString();
    return new Promise((resolve, reject) => {
      try {
        const worker = new Worker(
          `data:text/javascript;charset=UTF-8,onmessage = (
              () => 
                ({ data }) => 
                    postMessage(
                        (${func})(data)
                    )
            )(postMessage);`
        );
        worker.postMessage(message);
        worker.onmessage = ({ data }) => {
          resolve(data);
          worker.terminate();
        };
      } catch (e) {
        reject(e);
      }
    });
  }
  