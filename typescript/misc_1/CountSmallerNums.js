/**
 * Problem:
 * Given an array of integers, return an array where each element
 * is replaced by the number of elements to its right that are smaller than it.
 *
 * Example:
 * Input:  [5, 2, 6, 1]
 * Output: [2, 1, 1, 0]
 *
 * Explanation:
 * 5 -> two elements to the right are smaller (2, 1)
 * 2 -> one element to the right is smaller (1)
 * 6 -> one element to the right is smaller (1)
 * 1 -> no elements to the right
 *
 * Constraints:
 * - 1 <= nums.length <= 10^4
 * - -10^4 <= nums[i] <= 10^4
 *
 * Approach:
 * -
 *
 * Time: O()
 * Space: O()
 */


// iterate over array
// at each iteration, have another iteration that starts at the index of the current element + 1 
// then check how many are bigger in a local counter var. 
// at the end of inner loop set the counter to the element in the index position
// reset counter to 0, continue on 

function countSmaller(nums) {
    // implement here
    if (nums.length == 0) return []
    if (nums.length < 2) return [0]

    let resultArr = nums

    for (let i = 0; i < resultArr.length; i++) {
        let counter = 0
        for (let j = i + 1; j < resultArr.length; j++) {
            const curItem = resultArr[i]
            const nextItem = resultArr[j]

            if (nextItem < curItem) counter++
        }

        resultArr[i] = counter
    }

    return resultArr
}

// --- Tests ---
console.log(countSmaller([5, 2, 6, 1])); // expected: [2, 1, 1, 0]
console.log(countSmaller([1]));           // expected: [0]
console.log(countSmaller([2, 0, 1]));     // expected: [2, 0, 0]
console.log(countSmaller([]));            // expected: []
