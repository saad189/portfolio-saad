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

    const integers = [34, 95, 34, 64, 45, 95, 16, 80, 80, 75, 3, 25, 75, 25, 31, 3, 64, 16, 31];
    console.log('Loner:', this.lonelyinteger(integers));
  }

  lonelyinteger(a: number[]): number {

    const b = a.sort((j, k) => j - k);
    console.log(b)
    let loner = b[0];

    for (let i = 1; i < b.length; ++i) {
      if (b[i] !== loner) {
        loner = b[i];
      } else {
        loner = -1;
      }
    }
    return loner;
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
