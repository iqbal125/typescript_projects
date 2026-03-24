/**
 * LeetCode 49 — Group Anagrams (Medium)
 *
 * Given an array of strings, group the anagrams together.
 * You can return the answer in any order.
 *
 * Example:
 *   Input : ["eat","tea","tan","ate","nat","bat"]
 *   Output: [["eat","tea","ate"],["tan","nat"],["bat"]]
 *
 * Constraints:
 *   - 1 <= strs.length <= 10^4
 *   - 0 <= strs[i].length <= 100
 *   - strs[i] consists of lowercase English letters
 *

 * Time:  O(n * k log k)  where n = # of words, k = max word length
 * Space: O(n * k)
 */

// iterate over arr
// sort each element, and make it a key in an empty object 
// each key is an array of strings of the match 
// 

/**
 * @param {string[]} strs
 * @return {string[][]}
 */
function groupAnagrams(strs) {
    let matches = {}

    for (let i = 0; i < strs.length; i++) {
        let sortedItem = strs[i].split("").sort().join("")

        if (!matches[sortedItem]) {
            matches[sortedItem] = [strs[i]]
        } else {
            matches[sortedItem] = [...matches[sortedItem], strs[i]]
        }
    }

    return Object.values(matches)
}

// ─── Tests ────────────────────────────────────────────────────────────────────

const tests = [
    {
        input: ["eat", "tea", "tan", "ate", "nat", "bat"],
        expected: [["eat", "tea", "ate"], ["tan", "nat"], ["bat"]],
    },
    {
        input: [""],
        expected: [[""]],
    },
    {
        input: ["a"],
        expected: [["a"]],
    },
];

for (const { input, expected } of tests) {
    const result = groupAnagrams(input);
    // Sort inner arrays and outer array for stable comparison
    const normalize = (groups) =>
        groups.map((g) => g.sort()).sort((a, b) => a[0].localeCompare(b[0]));

    const pass =
        JSON.stringify(normalize(result)) ===
        JSON.stringify(normalize(expected));

    console.log(`Input: ${JSON.stringify(input)}`);
    console.log(`Result:   ${JSON.stringify(result)}`);
    console.log(`Status: ${pass ? "PASS ✓" : "FAIL ✗"}\n`);
}
