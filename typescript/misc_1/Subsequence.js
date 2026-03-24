/**
 * Problem: Is Subsequence (LeetCode #392)
 * Given two strings s and t, return true if s is a subsequence of t,
 * or false otherwise.
 *
 * A subsequence is a string derived from t by deleting some (or no)
 * characters without changing the order of the remaining characters.
 *
 * Example:
 * Input:  s = "ace", t = "abcde"
 * Output: true
 * Explanation: "ace" appears in order within "abcde"
 *
 * Input:  s = "aec", t = "abcde"
 * Output: false
 *
 * Constraints:
 * - 0 <= s.length <= 100
 * - 0 <= t.length <= 10^4
 * - s and t consist only of lowercase English letters
 *
 * Approach:
 * - Two pointers: i for s, j for t
 * - Walk through t. When s[i] === t[j], advance i.
 * - If i reaches s.length, every char in s was found in order → true.
 *
 * Time: O(n) where n = t.length
 * Space: O(1)
 */

function isSubsequence(s, t) {
    let i = 0;

    for (let j = 0; j < t.length && i < s.length; j++) {
        if (s[i] === t[j]) {
            i++;
        }
    }

    return i === s.length;
}

// --- Tests ---
console.log(isSubsequence("ace", "abcde"));  // expected: true
console.log(isSubsequence("aec", "abcde"));  // expected: false
console.log(isSubsequence("", "abcde"));     // expected: true
console.log(isSubsequence("a", "a"));        // expected: true
console.log(isSubsequence("b", "abc"));      // expected: true
console.log(isSubsequence("axc", "ahbgdc")); // expected: false
