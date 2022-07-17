import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'portfolio-saad';

  constructor() {
    this.main();
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

  plusMinus(arr: number[]): void {
    // Write your code here
    let n = arr.length;
    let positive = 0;
    let negative = 0;
    let zero = 0;

    arr.forEach(val => {
      if (val > 0) {
        positive++;
      }
      else if (val < 0) {
        negative++;
      }
      else {
        zero++;
      }
    });

    this.printValue(positive, n);
    this.printValue(negative, n);
    this.printValue(zero, n);
  }

  printValue(val: number, n: number): void {
    const data = (val / n).toPrecision(6).toString().substring(0, 8);
    console.log(data, val / n, val, n);
  }

  miniMaxSum(arr: number[]): void {
    // Write your code here
    const newArr = arr.sort();
    console.log(newArr);

    let min = 0;
    let max = 0;
    newArr.forEach((value, i) => {
      if (i == 0) {
        min += value;
      }
      else if (i == newArr.length - 1) {
        max += value;
      } else {
        min += value;
        max += value;
      }
    })

    console.log(min, max);

  }
  main() {


    const arr: number[] = [1, 3, 5, 7, 9];
    // console.log(
    //   this.timeConversion('01:05:45PM'),
    //   this.timeConversion('02:05:45PM'),
    //   this.timeConversion('03:05:45PM'),
    //   this.timeConversion('04:05:45PM'),
    //   this.timeConversion('05:05:45PM'),
    //   this.timeConversion('06:05:45PM'),
    //   this.timeConversion('07:05:45PM'),
    //   this.timeConversion('08:05:45PM'),
    //   this.timeConversion('09:05:45PM'),
    //   this.timeConversion('10:05:45PM'),
    //   this.timeConversion('11:05:45PM'),
    //   this.timeConversion('12:00:00AM'));

    const strings = ['ab', 'ab', 'abc', 'x'];
    const queries = ['ab', 'abc', 'bc'];

    //console.log(this.matchingStrings(strings, queries));

    // this.miniMaxSum(arr);

    // const integers = [34, 95, 34, 64, 45, 95, 16, 80, 80, 75, 3, 25, 75, 25, 31, 3, 64, 16, 31];
    //console.log('Loner:', this.lonelyinteger(integers));

    // const matrix: number[][] = [[11, 2, 4], [4, 5, 6], [10, 8, -12]];
    // console.log(this.diagonalDifference(matrix));

    // const sortValues = [63, 25, 73, 1, 98, 73, 56, 84, 86, 57, 16, 83, 8, 25, 81, 56, 9, 53, 98, 67, 99, 12, 83, 89, 80, 91,
    //   39, 86, 76, 85, 74, 39, 25, 90, 59, 10, 94, 32, 44, 3, 89, 30, 27, 79, 46, 96, 27, 32, 18, 21, 92, 69, 81, 40, 40, 34,
    //   68, 78, 24, 87, 42, 69, 23, 41, 78, 22, 6, 90, 99, 89, 50, 30, 20, 1, 43, 3, 70, 95, 33, 46, 44, 9, 69, 48, 33, 60,
    //   65, 16, 82, 67, 61, 32, 21, 79, 75, 75, 13, 87, 70, 33];

    // console.log({ sortValues, sorted: this.countingSort(sortValues) });

    // const text = 'We promptly judged antique ivory buckles for the next prize';
    // console.log(this.pangrams(text));

    console.log(this.buildArray([1, 3], 10));
  }


  buildArray(target: number[], n: number): string[] {

    const actions: string[] = [];

    for (let i = 1, x = 0; i <= n; ++i) {
      if (target[x] === i) {
        actions.push("Push");

        if (target[target.length - 1] === i) {
          i = n;
        }
        else {
          x++;
        }


      } else {
        actions.push("Push");
        actions.push("Pop");
      }

    }

    return actions;

  };

  pangrams(s: string): string {
    // Write your code here

    let isPangram = true;
    const newText = Array.from(new Set(s.replace(/ /g, '').toLowerCase().split(''))).sort();
    const alphabets = Array(26).fill(97).map((value, i) => String.fromCharCode(value + i));

    for (let i = 0; i < alphabets.length && isPangram; ++i) {
      if (alphabets[i] !== newText[i]) {
        isPangram = false;
      }

    }

    return isPangram ? 'pangram' : 'not pangram';
  }


  countingSort(arr: number[]): number[] {
    // Write your code here
    const countArr = Array(100).fill(0);

    arr.forEach((val, i) => countArr[val]++);

    return countArr;
  }

  diagonalDifference(arr: number[][]): number {
    // Write your code here
    let leftSum = 0;
    let rightSum = 0;


    for (let i = 0; i < arr.length; ++i) {
      leftSum += arr[i][i];
      rightSum += arr[i][arr.length - 1 - i];
      console.log({ leftSum, rightSum, i, r: arr.length - 1 - i })
    }

    return Math.abs(leftSum - rightSum);

  }

  lonelyinteger(a: number[]): number {
    const object: any = {};

    for (let i = 0; i < a.length; ++i) {
      const index = a[i];

      if (!(!!object[index] || object[index] >= 0)) {
        object[index] = 1;
      } else {
        object[index]++;
      }
    }

    return Number(Object.keys(object).find(key => object[key] === 1));
  }

  matchingStrings(strings: string[], queries: string[]): number[] {
    // Write your code here
    console.time('Test')
    const numberList = Array(queries.length).fill(0);
    for (let i = 0; i < strings.length; ++i) {

      for (let k = 0; k < queries.length; ++k) {
        if (queries[k] === strings[i]) {
          numberList[k]++;
        }
      }
    };

    console.timeEnd('Test');
    return numberList;
  }
  // 07:05:45PM 
  // hh:mm:ssPM/AM
  timeConversion(s: string): string {
    // Write your code here
    const isPost = s[s.length - 2] === "P";
    let pureDate = [...s.substring(0, s.length - 2)];

    let hours = Number(pureDate.slice(0, 2).join(''));

    if (isPost) {
      if (hours === 12) {
        return pureDate.join('');
      }
      hours += 12;
    }
    else {
      if (hours == 12) {
        hours -= 12;
      }
      else {
        return pureDate.join('');
      }
    }

    let convertedHours = hours.toString();
    convertedHours = convertedHours.length === 1 ? '0' + convertedHours : convertedHours;

    pureDate.splice(0, 2, convertedHours);

    return pureDate.join('');

  }

}
