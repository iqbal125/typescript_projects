/**
 * LeetCode 56 — Merge Intervals (Medium)
 *
 * Given an array of intervals where intervals[i] = [start_i, end_i],
 * merge all overlapping intervals, and return an array of the
 * non-overlapping intervals that cover all the intervals in the input.
 *
 * Examples:
 *   Input:  [[1,3],[2,6],[8,10],[15,18]]
 *   Output: [[1,6],[8,10],[15,18]]
 *
 *   Input:  [[1,4],[4,5]]
 *   Output: [[1,5]]
 *
 * Constraints:
 *   - 1 <= intervals.length <= 10^4
 *   - intervals[i].length == 2
 *   - 0 <= start_i <= end_i <= 10^4
 *
 * Approach:
 * - Sort by start value, then iterate and merge overlapping intervals
 *
 * Time:  O(n log n)
 * Space: O(n)
 */

function merge(intervals) {
    intervals.sort((a, b) => a[0] - b[0]);

    const result = [intervals[0]];

    for (let i = 1; i < intervals.length; i++) {
        const lastResult = result[result.length - 1];
        const curr = intervals[i];
        console.log("Next Iteration")
        console.log(curr, lastResult, result)

        if (curr[0] <= lastResult[1]) {
            console.log(lastResult, curr)
            lastResult[1] = Math.max(lastResult[1], curr[1]);
            console.log(lastResult, curr, result)
        } else {
            console.log(curr)
            result.push(curr);
        }
    }

    return result;
}

// ─── Tests ────────────────────────────────────────────────────────────────────

const tests = [
    {
        input: [[1, 3], [2, 6], [8, 10], [15, 18]],
        expected: [[1, 6], [8, 10], [15, 18]],
    },
    {
        input: [[1, 4], [4, 5]],
        expected: [[1, 5]],
    },
    {
        input: [[1, 4], [0, 4]],
        expected: [[0, 4]],
    },
    {
        input: [[1, 4], [2, 3]],
        expected: [[1, 4]],
    },
    {
        input: [[1, 1]],
        expected: [[1, 1]],
    },
];

// for (const { input, expected } of tests) {
//     const result = merge(input);
//     const pass = JSON.stringify(result) === JSON.stringify(expected);
//     console.log(pass ? "PASS" : "FAIL", "| Input:", JSON.stringify(input), "| Got:", JSON.stringify(result), "| Expected:", JSON.stringify(expected));
// }

const input = [[1, 3], [2, 6], [8, 10], [15, 18]]
// const result = merge(input);
// console.log(result)


// sort the intervals by the start time
// init the results array with the first interval
// loop through the array. starting at index 1. 
// have reference to last element in results array. 
// if the current start time is less than the end of the last element in results, then find the bigger end time between curr and last,
//  set it directly as the last end time
// if not push a new interval

const merge2 = (intervals) => {
    intervals.sort((a, b) => a[0] - b[0])

    const results = [intervals[0]]

    for (let i = 1; i < intervals.length; i++) {
        const lastResult = results[results.length - 1]
        const currItem = intervals[i]

        if (currItem[0] <= lastResult[1]) {
            lastResult[1] = Math.max(lastResult[1], currItem[1])
        } else {
            results.push(currItem)
        }
    }

    return results
}

console.log(merge2(input))