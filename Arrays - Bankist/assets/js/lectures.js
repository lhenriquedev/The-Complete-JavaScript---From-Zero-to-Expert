// LECTURES

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

//  ------------------------- MAP ------------------------------
const eurToUsd = 1.1;
// transform EUR to USD
const movementsUSD = movements.map(movement => movement * eurToUsd);

// FOR OF
const movementsUSDfor = [];
for (const movement of movements) {
  movementsUSDfor.push(movement * eurToUsd);
}

const movementsDescriptions = movements.map(
  (movement, i) =>
    `Movement ${i + 1}: You ${
      movement > 0 ? 'deposited' : 'withdrew'
    } ${Math.abs(movement)}`
);

console.log(movementsDescriptions);

// FILTER

// REDUCE
