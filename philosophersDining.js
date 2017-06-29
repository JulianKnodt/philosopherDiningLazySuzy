class Chopstick {}

class Person {
  constructor(name) {
    this.name = name;
    this.chopsticks = [];
    this.hungry = false;
    this.eating = false;
  }
  get isFulfilled() {
    return this.chopsticks.length >= 2;
  }
  get shouldEat() {
    return this.hungry && !this.eating;
  }
  startEating(table) {
    this.eating = true;
    setTimeout(() => {
      this.hungry = false;
      table.putBack(this.name);
      this.eating = false;
    }, 1)
  }
}


const rotate = arr => [...arr.slice(1), arr[0]];
let spinCallCount = 0;
let putBackCallCount = 0;
class LazySusan {
  constructor(numberOfPeople) {
    this.chopsticks = [];
    this.people = [];
    this.personSpinningIndex = -1;
    this.spinQueue = [];
  }
  seat(person) {
    this.people.push(person);
    if (person.hungry) this.spin(person.name);
  }
  grabChopstickForPerson(name) {
    const personIndex = this.people.findIndex(person => person.name === name);
    if (personIndex !== -1 && this.chopsticks[personIndex] !== undefined) {
      const person = this.people[personIndex];
      if (person.isFulfilled) return false;
      const chopstick = this.chopsticks[personIndex];
      person.chopsticks.push(chopstick);
      this.chopsticks[personIndex] = undefined;
      return true;
    }
    return false;
  }
  addDesireToSpin(name) {
    if (this.spinQueue.includes(name)) return false;
    this.spinQueue.push(name);
    return true;
  }
  nextInLine() {
    const nextName = this.spinQueue.shift();
    if (nextName === undefined) return false;
    const personIndex = this.people.findIndex(person => person.name === nextName);
    if (personIndex !== -1) {
      const person = this.people[personIndex];
      if (person.chopsticks.length) {
        this.putBack(person.name);
      } else {
        if (person.hungry) this.spin(person.name)
      }
      return true;
    }
  }
  putChopstickForPerson(name) {
    const personIndex = this.people.findIndex(person => person.name === name);
    if (personIndex !== -1 && this.chopsticks[personIndex] === undefined) {
      const person = this.people[personIndex];
      const chopstick = this.chopsticks[personIndex];
      if (chopstick === undefined && person.chopsticks.length) {
        this.chopsticks[personIndex] = person.chopsticks.pop();
        return true;
      }
      return false
    }
    return false;
  }
  rotateChopsticks() {
    this.chopsticks = rotate(this.chopsticks);
  }
  spin(name) {
    spinCallCount ++;
    const personIndex = this.people.findIndex(person => person.name === name);
    if (this.personSpinningIndex !== personIndex && this.personSpinningIndex !== -1) return this.addDesireToSpin(name);
    if (personIndex !== -1) {
      this.personSpinningIndex = personIndex;
      const person = this.people[personIndex];
      setTimeout(() => {
        let spinCountMax = this.chopsticks.length;
        while (!person.isFulfilled && spinCountMax) {
          this.rotateChopsticks();
          this.grabChopstickForPerson(person.name);
          spinCountMax --;
        };
        this.rotateChopsticks();
        spinCountMax = this.chopsticks.length;
        while (spinCountMax) {
          this.rotateChopsticks();
          this.people.forEach(person => {
            this.grabChopstickForPerson(person.name);
          });
          spinCountMax --;
        };
        this.people.forEach(person => {
          if (person.isFulfilled && person.shouldEat) person.startEating(this);
          if (person.chopsticks.length) this.putBack(person.name);
        });
        this.personSpinningIndex = -1;
        this.nextInLine();
      }, 1);
    }
    this.nextInLine();
    return false;
  }
  putBack(name) {
    putBackCallCount ++;
    const personIndex = this.people.findIndex(person => person.name === name);
    if (this.personSpinningIndex !== personIndex && this.personSpinningIndex !== -1) return this.addDesireToSpin(name);
    if (personIndex !== -1) {
      this.personSpinningIndex = personIndex;
      const person = this.people[personIndex];
      setTimeout(() => {
        while (person.chopsticks.length) {
          this.putChopstickForPerson(person.name);
          this.rotateChopsticks();
        };
        let spinCountMax = this.chopsticks.length;
        while (spinCountMax) {
          this.rotateChopsticks();
          this.people.forEach(person => {
            if (person.hungry) this.grabChopstickForPerson(person.name);
          });
          spinCountMax --;
        };
        this.people.forEach(person => {
          if (person.isFulfilled && person.shouldEat) person.startEating(this);
          if (person.chopsticks.length) this.putBack(person.name);
        });
        this.personSpinningIndex = -1;
        this.nextInLine();
      }, 1);
    }
    return false;
  }
  checkForSpinIntent() {
    const hungryPerson = this.people.find(person => person.hungry);
    if (hungryPerson !== undefined) this.spin(hungryPerson.name);
  }
}

const Isaac = new Person('Isaac');
const Samson = new Person('Samson');
const Delilah = new Person('Delilah');
const Maggy = new Person('Maggy');
const Eve = new Person('Eve');
Isaac.hungry = true;
Eve.hungry = true;
Samson.hungry = true;
Delilah.hungry = true;
Maggy.hungry = true;

const table = new LazySusan(5);
table.chopsticks = Array(5).fill(new Chopstick);

table.seat(Isaac);
table.seat(Samson);
table.seat(Delilah);
table.seat(Maggy);
table.seat(Eve);



let counter = 0;
let interval;
interval = setInterval(() => {
  if (~~(Math.random() * 2)) Isaac.hungry = true;
  if (~~(Math.random() * 2)) Eve.hungry = true;
  if (~~(Math.random() * 2)) Samson.hungry = true;
  if (~~(Math.random() * 2)) Delilah.hungry = true;
  if (~~(Math.random() * 2)) Eve.hungry = true;
  counter ++;
  table.checkForSpinIntent();
  if (counter === 10) {
    clearInterval(interval);
    setTimeout(() => {
      console.log(table);
      console.log(spinCallCount, putBackCallCount)
    }, 20);
  }
}, 20);




