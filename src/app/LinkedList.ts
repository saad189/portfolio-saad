/**
 * Definition for singly-linked list.
 * class ListNode {
 *     val: number
 *     next: ListNode | null
 *     constructor(val?: number, next?: ListNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.next = (next===undefined ? null : next)
 *     }
 * }
 */


function traverseList(linkedList:ListNode|null,value:number[]=[] ): number[]{
    if (linkedList == null){
        return;
    }
    value.push(linkedList.val);
    traverseList(linkedList.next,value);
    return value;
}


function buildList(values:number[]):ListNode {
    let list = new ListNode();
    const rootNode = list;
    for (let i = 0  ;i < values.length-1;++i){
        list.val = values[i];
        list.next = new ListNode();
        list = list.next;
    }
     list.val = values[values.length-1];
    return rootNode;
}

function performSum(first:number[],second:number[]):number[]{
    const length = Math.max(first.length,second.length);
    const newArray:number[] = [];
    let carry = 0;
    for (let i = 0; i < length+carry;++i){
        const sum = (first[i] ? first[i]:0) + (second[i] ? second[i]:0) + carry;
        carry = sum > 9 ? 1: 0;
        const amountToAdd = sum > 9 ? sum - 10:sum;
        newArray.push(amountToAdd);
    }
    return newArray;
}

function addTwoNumbers(l1: ListNode | null, l2: ListNode | null): ListNode | null {

    let newList = new ListNode();
    let carry = 0;
    const head = newList;
    for (; l1 !== null || l2 !==null || carry;){
        const sum = (l1 ? l1.val : 0) + (l2 ? l2.val : 0) + carry;
        carry = sum > 9 ? 1 :0;
        const amountToAdd = sum > 9 ? sum - 10:sum;
        newList.val = amountToAdd;
        l1 = l1 ? l1.next : null;
        l2 = l2 ? l2.next : null;
        newList = newList.next;
        newList = new ListNode(); 
    }
    
    return head;
};


/**
 * Definition for singly-linked list.
 * class ListNode {
 *     val: number
 *     next: ListNode | null
 *     constructor(val?: number, next?: ListNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.next = (next===undefined ? null : next)
 *     }
 * }
 */

 function addTwoNumbers(l1: ListNode | null, l2: ListNode | null, newList:ListNode|null = null,carry = 0): ListNode | null {

    if (!newList){
        newList = new ListNode();
    }

    if (l1 == null && l2 == null && carry == 0){
        return;
    }

const sum = (l1 ? l1.val : 0) + (l2 ? l2.val : 0) + carry;
carry = sum > 9 ? 1 :0;
const amountToAdd = sum > 9 ? sum - 10:sum;
newList.val = amountToAdd;

if ( (l1 && l1.next) || (l2 && l2.next) || carry){
    newList.next = new ListNode();
}

addTwoNumbers(l1 ? l1.next : null,l2 ? l2.next :null,newList.next,carry);
return newList;
};