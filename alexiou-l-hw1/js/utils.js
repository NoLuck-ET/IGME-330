/*
randomWord: returns a single random variable from a given array.
Input: array
Output: variable
*/
export const randomWord = (array) => {
    return array[Math.floor(Math.random() * array.length)];
};