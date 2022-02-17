import "./styles.css";
import { MinPriorityQueue } from "@datastructures-js/priority-queue";

export default function App() {
  // Input:
  // K - thickness of convex hull, 1 <= K <= 200
  // N = number of islands, 2 <= N <= 2000
  // M = number of routes, 1 <= M <= 10000
  // A - start island
  // B - end island
  // where A <= A, B <= N; A != B
  // routes - number[][], each row has exact four elements [a, b, t, h],
  // where a - start island
  //       b - end island
  //       t - time spent
  //       h - tickness of convex hull wore down
  // given a != b
  //
  // Output: Integer - minimal time required to travel from A to B without wearing
  // out the ship's hull, or -1 to indicate no such answer.
  const travel = (K, N, A, B, routes) => {
    const adjacencyMap = new Map();
    const bestTimeAndCost = new Array(N + 1).fill(null).map((x) => []);
    bestTimeAndCost[A].push([0, 0]);
    const minHeap = new MinPriorityQueue({
      priority: (obj) => obj.time
    });
    minHeap.enqueue({ island: A, time: 0, cost: 0 });

    // populate map
    for (let route of routes) {
      const [island1, island2, time, cost] = route;
      if (!adjacencyMap.has(island1)) adjacencyMap.set(island1, []);
      if (!adjacencyMap.has(island2)) adjacencyMap.set(island2, []);
      adjacencyMap.get(island1).push([island2, time, cost]);
      adjacencyMap.get(island2).push([island1, time, cost]);
    }

    // BFS
    while (!minHeap.isEmpty()) {
      const { island, time, cost } = minHeap.dequeue().element;
      if (island === B) return time;

      if (adjacencyMap.has(island)) {
        for (let [end, routeTime, routeCost] of adjacencyMap.get(island)) {
          const totalCost = cost + routeCost;
          if (totalCost >= K) continue;
          const totalTime = time + routeTime;

          let isBetter = true;
          for (let [bestTime, bestCost] of bestTimeAndCost[end]) {
            if (bestTime <= totalTime && bestCost <= totalCost) {
              isBetter = false;
              break;
            }
          }

          if (isBetter) {
            bestTimeAndCost[end].push([totalTime, totalCost]);
            minHeap.enqueue({ island: end, time: totalTime, cost: totalCost });
          }
        }
      }
    }

    return -1;
  };

  // Test 1
  const K = 10;
  const N = 4;
  const routes = [
    [1, 2, 4, 4],
    [1, 3, 7, 2],
    [3, 1, 8, 1],
    [3, 2, 2, 2],
    [4, 2, 1, 6],
    [3, 4, 1, 1],
    [1, 4, 6, 12]
  ];
  const A = 1;
  const B = 4;
  const result = travel(K, N, A, B, routes);
  console.log(result);

  // Test 2
  const K2 = 3;
  const N2 = 3;
  const routes2 = [
    [1, 2, 5, 1],
    [3, 2, 8, 2],
    [1, 3, 1, 3]
  ];
  const A2 = 1;
  const B2 = 3;
  const result2 = travel(K2, N2, A2, B2, routes2);
  console.log(result2);

  return (
    <div className="App">
      <h1>Convex Hull</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
}
