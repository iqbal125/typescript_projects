/**
 * Flatten a Nested Array
 * 
 * Write a function that takes a deeply nested array and returns
 * a single flat array with all values.
 * 
 * You may NOT use Array.prototype.flat() or Array.prototype.flatMap().
 * 
 * Examples:
 *   flatten([1, [2, [3, [4]], 5]]) → [1, 2, 3, 4, 5]
 *   flatten([[1, 2], [3, [4, [5, 6]]]]) → [1, 2, 3, 4, 5, 6]
 *   flatten([[], [1], [[2]]]) → [1, 2]
 */


//handle base cases 

// iterate over arr using while true
//

function flatten(arr) {
    // your code here
    if (arr.length == 0) {
        return
    }

    if (arr.length == 1) {
        return arr
    }

    let stack = [...arr]
    let result = []

    while (stack.length) {
        const item = stack.pop();

        console.log("Next Iteration")
        console.log("item", item, "stack", stack)
        if (Array.isArray(item)) {
            stack = [...stack, ...item];
        } else {
            result = [item, ...result]
        }
        console.log("result", result, "stack", stack)
    }

    return result
}


const result = flatten([[1, 2], [3, [4, [5, 6]]]])
console.log(result)



// handle base case of 0 and 1
// use stack data structure, use pop and keep adding back the flattened array. 
// check if array, if yes push into the array, if not add into result.
// reverse at the end to return


const flatten2 = (arr) => {
    const stack = [...arr]
    const result = []

    while (stack.length) {
        const item = stack.pop()

        if (Array.isArray(item)) {
            stack.push(...item)
        } else {
            result.push(item)
        }
    }
    return result.reverse()
}


const result2 = flatten2([[1, 2], [3, [4, [5, 6]]]])
console.log("result2", result2)