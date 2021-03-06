'use strict';

/////////////////////////////////////////////////
// BANKIST APP

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

// array that contains all accounts
const accounts = [account1, account2, account3, account4];

/////////////////////////////////////////////////
// BANKIST CODE
/////////////////////////////////////////////////

const displayMovements = (movements, sort = false) => {
  // clear container
  containerMovements.innerHTML = '';

  // SORT
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  // loop array movements
  movs.forEach((movement, i) => {
    const type = movement > 0 ? 'deposit' : 'withdrawal';

    // create html
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div> 
        <div class="movements__value">${Math.abs(movement)}€</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = acc => {
  acc.balance = acc.movements.reduce((acc, movement) => acc + movement, 0);

  labelBalance.textContent = `${acc.balance}€`;
};

// access entire objects in accounts array
const calcDisplaySummary = accs => {
  // deposit
  const incomes = accs.movements
    .filter(mov => mov >= 0)
    .reduce((acc, mov) => acc + mov, 0);

  // withdrawls
  const out = accs.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  // interest
  const interest = accs.movements
    .filter(mov => mov >= 0)
    .map(deposit => (deposit * accs.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);

  labelSumIn.textContent = `${incomes}€`;
  labelSumOut.textContent = `${Math.abs(out)}€`;
  labelSumInterest.textContent = `${interest}€`;
};

// access entire objects in accounts array
const createUsernames = accs => {
  // loop array accounts
  accs.forEach(acc => {
    // create a property called: username
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUsernames(accounts);

const updateUI = acc => {
  // 1) Display Movements
  displayMovements(acc.movements);
  // 2) Display Balance
  calcDisplayBalance(acc);
  // 3) Display Summary
  calcDisplaySummary(acc);
};

// ----------------------- EVENT HANDLERS ------------------- //

// outside variable that contains the currenct account
let currentAccount;
btnLogin.addEventListener('click', e => {
  e.preventDefault();

  // find account and returns the object
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  // pin of current account has correct, then show
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // 1) Display UI and Welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', e => {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    account => account.username === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', e => {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);
  const requestLoan = currentAccount.movements.some(mov => mov >= amount * 0.1);

  if (amount > 0 && requestLoan) {
    // Add movement
    currentAccount.movements.push(amount);

    // UpdateUI
    updateUI(currentAccount);
  }

  inputLoanAmount.value = '';
});

// Button Close
btnClose.addEventListener('click', e => {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    // return index of account
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    // Delete account
    accounts.splice(index, 1);

    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', e => {
  e.preventDefault();

  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
