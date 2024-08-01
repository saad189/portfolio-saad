import { ViewportScroller } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { cloneDeep } from 'lodash';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'portfolio-saad';
  showScroll = false;
  pageYoffset = 0;

  @HostListener('window:scroll', ['$event']) onScroll(event: any) {
    this.pageYoffset = window.pageYOffset;
  }

  scrollToTop() {
    this.scroll.scrollToPosition([0, 0]);
  }
  constructor(private scroll: ViewportScroller) {
    //  this.main();
    /**
     * Things to Implement:
     * 1. GSAP
     * 2. Single Page?
     * 3. Projects
     * 4. Profile Image
     * 5. About Me
     * 6. About Website
     * 7. Deployment
     * 8. Resume Download
     * 9. Hire Me Page -> Form Submission
     */
  }


  /*
   * Complete the 'plusMinus' function below.
   *
   * The function accepts INTEGER_ARRAY arr as parameter.
   */

  // plusMinus(arr: number[]): void {
  //   // Write your code here
  //   let n = arr.length;
  //   let positive = 0;
  //   let negative = 0;
  //   let zero = 0;

  //   arr.forEach(val => {
  //     if (val > 0) {
  //       positive++;
  //     }
  //     else if (val < 0) {
  //       negative++;
  //     }
  //     else {
  //       zero++;
  //     }
  //   });

  //   this.printValue(positive, n);
  //   this.printValue(negative, n);
  //   this.printValue(zero, n);
  // }

  // printValue(val: number, n: number): void {
  //   const data = (val / n).toPrecision(6).toString().substring(0, 8);
  //   console.log(data, val / n, val, n);
  // }

  // miniMaxSum(arr: number[]): void {
  //   // Write your code here
  //   const newArr = arr.sort();
  //   console.log(newArr);

  //   let min = 0;
  //   let max = 0;
  //   newArr.forEach((value, i) => {
  //     if (i == 0) {
  //       min += value;
  //     }
  //     else if (i == newArr.length - 1) {
  //       max += value;
  //     } else {
  //       min += value;
  //       max += value;
  //     }
  //   })

  //   console.log(min, max);

  // }
  // main() {
  //   const arr: number[] = [1, 3, 5, 7, 9];
  //   // console.log(
  //   //   this.timeConversion('01:05:45PM'),
  //   //   this.timeConversion('02:05:45PM'),
  //   //   this.timeConversion('03:05:45PM'),
  //   //   this.timeConversion('04:05:45PM'),
  //   //   this.timeConversion('05:05:45PM'),
  //   //   this.timeConversion('06:05:45PM'),
  //   //   this.timeConversion('07:05:45PM'),
  //   //   this.timeConversion('08:05:45PM'),
  //   //   this.timeConversion('09:05:45PM'),
  //   //   this.timeConversion('10:05:45PM'),
  //   //   this.timeConversion('11:05:45PM'),
  //   //   this.timeConversion('12:00:00AM'));

  //   const strings = ['ab', 'ab', 'abc', 'x'];
  //   const queries = ['ab', 'abc', 'bc'];

  //   //console.log(this.matchingStrings(strings, queries));

  //   // this.miniMaxSum(arr);

  //   // const integers = [34, 95, 34, 64, 45, 95, 16, 80, 80, 75, 3, 25, 75, 25, 31, 3, 64, 16, 31];
  //   //console.log('Loner:', this.lonelyinteger(integers));

  //   // const matrix: number[][] = [[11, 2, 4], [4, 5, 6], [10, 8, -12]];
  //   // console.log(this.diagonalDifference(matrix));

  //   // const sortValues = [63, 25, 73, 1, 98, 73, 56, 84, 86, 57, 16, 83, 8, 25, 81, 56, 9, 53, 98, 67, 99, 12, 83, 89, 80, 91,
  //   //   39, 86, 76, 85, 74, 39, 25, 90, 59, 10, 94, 32, 44, 3, 89, 30, 27, 79, 46, 96, 27, 32, 18, 21, 92, 69, 81, 40, 40, 34,
  //   //   68, 78, 24, 87, 42, 69, 23, 41, 78, 22, 6, 90, 99, 89, 50, 30, 20, 1, 43, 3, 70, 95, 33, 46, 44, 9, 69, 48, 33, 60,
  //   //   65, 16, 82, 67, 61, 32, 21, 79, 75, 75, 13, 87, 70, 33];

  //   // console.log({ sortValues, sorted: this.countingSort(sortValues) });

  //   // const text = 'We promptly judged antique ivory buckles for the next prize';
  //   // console.log(this.pangrams(text));

  //   // console.log(this.buildArray([1, 3], 10));

  //   // console.log(this.twoArrays(10, [2, 1, 3], [7, 8, 9]));
  //   //   console.log(this.birthday([2, 2, 1, 3, 2], 4, 2));
  //   //console.log(this.sockMerchant(0, [10, 20, 20, 10, 10, 30, 50, 10, 20]))
  //   // console.log(this.pageCount(15, 5));
  //   // for (let i = 0; i < 25; ++i) {
  //   //   console.log(i, this.sumXor(i), i ^ 10);
  //   // }
  //   // XOR ^ 
  //   // console.log(this.isValid('(([][][]))(){}'));
  //   // //console.log(this.longestValidParentheses('()(()'))
  //   // console.log(this.longestPalindrome('babad'));
  //   // console.log(this.longestPalindrome('cbbd'));
  //   // console.log(this.longestPalindrome(''));
  //   // console.log(this.longestPalindrome('ccc'));
  //   // console.log(this.longestPalindrome('aaaa'));
  //   // console.log(this.longestPalindrome('baabbaa'))
  //   // console.log(this.longestPalindrome(`aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
  //   // aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
  //   // aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
  //   // aaaaaaaaaaaaaaaaaaaaaaaaaaaaaabcaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
  //   // aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
  //   // aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
  //   // aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`))
  //   // // console.log(this.letterCombinations('234'));


  //   console.log(this.solveNQueens(4));
  //   // console.log(this.lengthOfLastWord("  fly me to the moon "))
  // }

  // lengthOfLastWord(s: string): number {
  //   const clean = s.split(/\s/);
  //   console.log(clean);
  //   return clean[clean.length - 1].length;
  // };

  // private printBoard(b: string[][]): void {
  //   console.log(b);
  // }
  // private buildBoard(n: number): string[][] {
  //   const arr: string[][] = [];
  //   for (let i = 0; i < n; ++i) {
  //     arr.push([]);
  //     for (let x = 0; x < n; ++x) {
  //       arr[i].push('.');
  //     }
  //   }

  //   return arr;
  // }


  // checkAttack(b: string[][], horizontal: number, vertical: number): { i: number, j: number }[] {
  //   let n = b.length;
  //   const stack: any[] = [];
  //   let shouldMove = false;

  //   for (let i = 0; i < n && !shouldMove; ++i) { // Horizontal
  //     if (b[horizontal][i] == 'Q' && i !== vertical) {
  //       stack.push({ i: horizontal, j: i });
  //       shouldMove = true;
  //     }
  //   }

  //   shouldMove = false;
  //   for (let i = 0; i < n && !shouldMove; ++i) { // Vertical
  //     if (b[i][vertical] == 'Q' && i !== horizontal) {
  //       stack.push({ i, j: vertical });
  //       shouldMove = true;
  //     }
  //   }

  //   shouldMove = false;

  //   let row = 0;
  //   let col = 0;

  //   if (horizontal < vertical) {
  //     row = 0;
  //     col = vertical - horizontal;
  //   } else {
  //     col = 0;
  //     row = horizontal - vertical;
  //   }

  //   console.log({ row, col }, 'Start');
  //   for (let i = row; i < n && !shouldMove;) { // Diagonal Start
  //     for (let x = col; x < n && i < n && !shouldMove; ++x, ++i) {
  //       if (b[i][x] == 'Q' && i !== horizontal && x !== vertical) {
  //         stack.push({ i, j: x });
  //         shouldMove = true;
  //       }
  //     }
  //   }

  //   shouldMove = false;


  //   if ((n - 1 - horizontal) < vertical) {
  //     row = n - 1;
  //     col = vertical - (n - 1 - horizontal);
  //   }
  //   else {
  //     col = 0;
  //     row = vertical + horizontal;
  //   }
  //   console.log({ row, col }, 'End');

  //   for (let i = row; i >= 0 && !shouldMove;) { // Diagonal End
  //     for (let x = col; x < n && i >= 0 && !shouldMove; ++x, --i) {
  //       if (b[i][x] == 'Q' && i !== horizontal && x !== vertical) {
  //         stack.push({ i, j: x });
  //         shouldMove = true;
  //       }
  //     }
  //   }
  //   return stack;
  // }

  // checkCollission(b: string[][], row: number, column: number): any {
  //   let shouldMove = false;
  //   let n = b.length;

  //   shouldMove = false;
  // }

  // solveNQueens(n: number): string[][] {
  //   const board = this.buildBoard(n);
  //   // board[0] = Array(n).fill('Q');
  //   board[0][0] = 'Q';
  //   board[1][1] = 'Q';
  //   board[1][2] = 'Q';
  //   board[3][2] = 'Q';
  //   for (let i = 0; i < n; ++i) {
  //     for (let x = 0; x < n; ++x) {
  //       console.log({ row: x, column: i, stats: cloneDeep(this.checkAttack(board, x, i)), board: cloneDeep(board) });
  //     }
  //   }
  //   this.printBoard(board);




  //   return board;
  // }



  // letterCombinations(digits: string): string[] {

  //   let dict: any = {
  //     2: 'abc',
  //     3: 'def',
  //     4: 'ghi',
  //     5: 'jkl',
  //     6: 'mno',
  //     7: 'pqrs',
  //     8: 'tuv',
  //     9: 'wxyz'
  //   };

  //   // Input: digits = "23"
  //   // Output: ["ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf"]

  //   let totalLegnth = 1;
  //   let maxLength = 0;
  //   for (let i = 0; i < digits.length; ++i) {
  //     const currLen = dict[digits[i]].length;
  //     totalLegnth *= currLen;
  //     if (currLen > maxLength) {
  //       maxLength = currLen;
  //     }
  //   }
  //   const out: string[] = Array(totalLegnth);


  //   for (let z = 0; z < digits.length; ++z) {
  //     const currStr = dict[digits[z]];
  //     console.log({ currStr, maxLength })
  //     for (let i = 0, index = 0; i < out.length; ++i) {
  //       out[i] = out[i] ? out[i] + currStr[index] : currStr[index];
  //       if ((i + 1) % maxLength == 0 || (digits.length - z) % 2 == 1) {
  //         index = index == maxLength - 1 ? 0 : index + 1;
  //       }

  //       console.log({ out: [...out], index, i })
  //     }
  //   }

  //   console.log({ totalLegnth })
  //   return out;
  // };

  // longestPalindrome(s: string): string {
  //   let maxPal = "";
  //   for (let i = 0; i < s.length; ++i) {
  //     let subStr = "";
  //     let isPal = false;
  //     for (let j = s.length - 1; j >= 0 && !isPal; --j) {
  //       subStr = s.slice(i, j + 1);
  //       isPal = this.isPalindrome(subStr);
  //     }
  //     if (isPal && subStr.length > maxPal.length) {
  //       maxPal = subStr;
  //     }
  //   }
  //   return maxPal;
  // };


  // isPalindrome(s: string): boolean {
  //   for (let i = 0, j = s.length - 1; i < s.length; ++i, --j) {
  //     if (s[i] !== s[j]) {
  //       return false;
  //     }
  //   }
  //   return true;
  // }


  // longestValidParentheses(s: string): number {
  //   let maxLength = 0;
  //   const dict: any = {};
  //   let sum = 0;
  //   let currentIndex = 0;

  //   let stack: string[] = [];
  //   for (let i = 0; i < s.length; ++i) {
  //     if (s[i] == '(') {
  //       stack.unshift('(');
  //       dict[i] = sum;
  //       currentIndex = i;
  //     } else if (stack.shift() == '(') {
  //       sum += 2;
  //       if (stack.length == 0)
  //         dict[currentIndex] = sum;
  //       else
  //         sum = dict[currentIndex]
  //     } else {
  //       maxLength = Math.max(maxLength, sum);
  //       sum = 0;
  //       stack = [];
  //     }
  //   }
  //   // sum = stack.length ? 0 : sum
  //   console.log(dict);
  //   return Math.max(maxLength, sum);
  // };

  // isValid(s: string): boolean {
  //   const test: any = {
  //     '(': ')',
  //     '{': '}',
  //     '[': ']'
  //   };

  //   const stack: string[] = [];
  //   const arr = [...s];
  //   for (let i = 0; i < arr.length; ++i) {
  //     console.log({ stack, currentValue: arr[i], Test: test[arr[i]], condition: stack.length && !test[arr[i]] });
  //     if (test[arr[i]]) {
  //       stack.unshift(arr[i]);
  //     } else if (test[stack.shift() as string] !== arr[i]) {
  //       return false;
  //     }
  //   }
  //   return true;
  // };


  // toBinary(n: number): string {
  //   let value = n;
  //   const obj: any = {};

  //   for (let i = 14; i >= 0; --i) {
  //     const power = Math.pow(2, i);
  //     obj[power] = 0;
  //     if (value - power >= 0) {
  //       obj[power] = 1;
  //       value = value - power;
  //     }
  //   }
  //   const lol = Object.values(obj).toString().replace(/,/g, '');
  //   return lol;
  // }

  // xOr(first: string, second: string): string {
  //   const arr: string[] = [];
  //   for (let i = 0; i < first.length; ++i) {
  //     arr.push(Number(first[i]) + Number(second[i]) === 1 ? '1' : '0');
  //   }

  //   return arr.toString().replace(/,/g, '');
  // }

  // sumXor(n: number): number {
  //   let sum = 0;
  //   for (let i = 0; i <= n; ++i) {
  //     if (this.toBinary(n + i) === this.xOr(this.toBinary(n), this.toBinary(i))) {
  //       sum++;
  //     }
  //   }
  //   return sum;
  // }

  // pageCount(n: number, p: number): number {
  //   return Math.min(Math.ceil((p - 1) / 2), Math.ceil((n - p - (n % 2 == 0 || n - p === 0 ? 0 : 1)) / 2));
  // }

  // sockMerchant(n: number, ar: number[]): number {
  //   // Write your code here
  //   const keys: any = {};

  //   ar.forEach(value => {
  //     if (!(!!keys[value] || keys[value] >= 0)) {
  //       keys[value] = 1;
  //     }
  //     else {
  //       keys[value]++;
  //     }
  //   });

  //   let sum = 0;
  //   Object.keys(keys).forEach(key => {
  //     sum += Math.floor(keys[key] / 2);
  //   });

  //   return sum;
  // }

  // birthday(s: number[], d: number, m: number): number {
  //   // Write your code here

  //   let div = 0;

  //   for (let i = 0; i < s.length; ++i) {
  //     let sum = 0;
  //     for (let x = 0; x < m; ++x) {
  //       sum += s[i + x];
  //     }
  //     console.log(sum)
  //     if (sum === d) {
  //       div++;
  //     }
  //   }
  //   return div;
  // }

  // twoArrays(k: number, A: number[], B: number[]): string {
  //   // Write your code here
  //   let isValid = true;


  //   const sortedA = A.sort((a, b) => a - b);
  //   const sortedB = B.sort((a, b) => b - a);

  //   sortedA.forEach((valA, i) => {
  //     if (isValid && valA + sortedB[i] < k) {
  //       isValid = false;
  //     }
  //   })
  //   let dict = {};


  //   return isValid ? 'YES' : 'NO';

  // }

  // buildArray(target: number[], n: number): string[] {

  //   const actions: string[] = [];

  //   for (let i = 1, x = 0; i <= n; ++i) {
  //     if (target[x] === i) {
  //       actions.push("Push");

  //       if (target[target.length - 1] === i) {
  //         i = n;
  //       }
  //       else {
  //         x++;
  //       }


  //     } else {
  //       actions.push("Push");
  //       actions.push("Pop");
  //     }

  //   }

  //   return actions;

  // };

  // pangrams(s: string): string {
  //   // Write your code here

  //   let isPangram = true;
  //   const newText = Array.from(new Set(s.replace(/ /g, '').toLowerCase().split(''))).sort();
  //   const alphabets = Array(26).fill(97).map((value, i) => String.fromCharCode(value + i));

  //   for (let i = 0; i < alphabets.length && isPangram; ++i) {
  //     if (alphabets[i] !== newText[i]) {
  //       isPangram = false;
  //     }

  //   }

  //   return isPangram ? 'pangram' : 'not pangram';
  // }


  // countingSort(arr: number[]): number[] {
  //   // Write your code here
  //   const countArr = Array(100).fill(0);

  //   arr.forEach((val, i) => countArr[val]++);

  //   return countArr;
  // }

  // diagonalDifference(arr: number[][]): number {
  //   // Write your code here
  //   let leftSum = 0;
  //   let rightSum = 0;


  //   for (let i = 0; i < arr.length; ++i) {
  //     leftSum += arr[i][i];
  //     rightSum += arr[i][arr.length - 1 - i];
  //     console.log({ leftSum, rightSum, i, r: arr.length - 1 - i })
  //   }

  //   return Math.abs(leftSum - rightSum);

  // }

  // lonelyinteger(a: number[]): number {
  //   const object: any = {};

  //   for (let i = 0; i < a.length; ++i) {
  //     const index = a[i];

  //     if (!(!!object[index] || object[index] >= 0)) {
  //       object[index] = 1;
  //     } else {
  //       object[index]++;
  //     }
  //   }
  //   const arr: any[] = [];
  //   arr.splice(0, 0, 1);
  //   return Number(Object.keys(object).find(key => object[key] === 1));
  // }

  // matchingStrings(strings: string[], queries: string[]): number[] {
  //   // Write your code here
  //   console.time('Test')
  //   const numberList = Array(queries.length).fill(0);
  //   for (let i = 0; i < strings.length; ++i) {

  //     for (let k = 0; k < queries.length; ++k) {
  //       if (queries[k] === strings[i]) {
  //         numberList[k]++;
  //       }
  //     }
  //   };

  //   console.timeEnd('Test');
  //   return numberList;
  // }
  // // 07:05:45PM 
  // // hh:mm:ssPM/AM
  // timeConversion(s: string): string {
  //   // Write your code here
  //   const isPost = s[s.length - 2] === "P";
  //   let pureDate = [...s.substring(0, s.length - 2)];

  //   let hours = Number(pureDate.slice(0, 2).join(''));

  //   if (isPost) {
  //     if (hours === 12) {
  //       return pureDate.join('');
  //     }
  //     hours += 12;
  //   }
  //   else {
  //     if (hours == 12) {
  //       hours -= 12;
  //     }
  //     else {
  //       return pureDate.join('');
  //     }
  //   }

  //   let convertedHours = hours.toString();
  //   convertedHours = convertedHours.length === 1 ? '0' + convertedHours : convertedHours;

  //   pureDate.splice(0, 2, convertedHours);

  //   return pureDate.join('');

  // }

}
