// js does not come with a built in priority queue so we have to implement one ourselves
//copied and modified
//PQ is basically a queue based data structure that serves the queue's first in first out rule with a priority value. The elements stored
//in this are queued according to their priority values which can be defined

class QElement {
  constructor(element, priority) {
    this.element = element;
    this.priority = priority;
  }
}

class PriorityQueue {
  //modified to act as set which contains only one of each element
  constructor() {
    this.items = [];
  }

  push(element, priority) {
    let qElement = new QElement(element, priority);
    // console.log(qElement);

    let contain = false;
    let isPushed = false;
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].element === qElement.element) {
        contain = true;
        break;
      }
    }

    if (!contain) {
      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i].priority > qElement.priority) {
          this.items.splice(i, 0, qElement);
          isPushed = true;
          break;
        }
      }

      if (!isPushed) {
        this.items.push(qElement);
      }
    }
  }

  remove() {
    if (this.isEmpty()) return "Underflow";
    return this.items.shift();
  }

  removeAll() {
    while (!this.isEmpty()) this.items.shift();
  }

  front() {
    if (this.isEmpty()) return "No elements in Queue";
    return this.items[0];
  }

  rear() {
    if (this.isEmpty()) return "No elements in Queue";
    return this.items[this.items.length - 1];
  }

  isEmpty() {
    return this.items.length == 0;
  }

  printPQueue() {
    var str = "";
    for (var i = 0; i < this.items.length; i++)
      str += this.items[i].element + " ";
    return str;
  }
}
