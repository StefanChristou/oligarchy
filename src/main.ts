import {randFullName} from "@ngneat/falso";

type ID = string;

type Actor = {
  id: Readonly<ID>;
  funds: number;
  name: string;
}

function createId(): ID {
  return Math.random().toString(36).substr(2, 9);
}

function createActor(richKid = false): Actor {
  return {
    id: createId(),
    funds: richKid ? 10000 : 1000,
    name: richKid ? "Sir " + randFullName() : randFullName(),
  }
}

function doTransaction(actor1: Actor, actor2: Actor) {
  const maxAmount = Math.min(actor1.funds, actor2.funds);

  if (maxAmount > 0.02) {
    const transactionStake = Math.random() * maxAmount * 0.2;
    actor1.funds += transactionStake;
    actor2.funds -= transactionStake;

    transactionLog.push({
      winnerId: actor1.id,
      loserId: actor2.id,
      amount: transactionStake,
      winnerFunds: actor1.funds,
      loserFunds: actor2.funds,
    });
  }
}

function toTwoDecimalPlaces(num: number) {
  return Math.round(num * 100) / 100;
}

function runEconomyForNIterations(actors: Actor[], n: number) {
  for (let i = 0; i < n; i++) {
    const actor1 = actors[Math.random() * actors.length | 0];
    const actor2 = actors[Math.random() * actors.length | 0];
    doTransaction(actor1, actor2);
  }
  return actors;
}

const numberOfActors = 1000;
const numberOfTransactionsPerActor = 100000;
const iterations = numberOfActors * numberOfTransactionsPerActor / 2;
const actors = Array.from({length: numberOfActors}, createActor).sort((a, b) => b.funds - a.funds);
const totalStartingStake = actors.reduce((acc, actor) => acc + actor.funds, 0);

const transactionLog = [];

console.log("Starting actors");
console.table(Object.fromEntries([
  ...actors.slice(0, 20).map(actor => [actor.name, Math.round(actor.funds).toLocaleString()]),
  [`${numberOfActors - 20} more...`, actors.slice(20, actors.length).reduce((acc, actor) => acc + actor.funds, 0).toLocaleString()]
]));

const startTime = Date.now();
const finalActors = runEconomyForNIterations(actors, iterations);
const endTime = Date.now();

const totalEndStake = actors.reduce((acc, actor) => acc + actor.funds, 0);
const finalActorsSorted = finalActors.sort((a, b) => b.funds - a.funds);

const gameInfo = {
  "Total starting stake": totalStartingStake.toFixed(2).toLocaleString(),
  "Total end stake": toTwoDecimalPlaces(totalEndStake).toLocaleString(),
  "Time taken": ((endTime - startTime) / 100).toLocaleString() + " seconds",
  "Transactions": iterations.toLocaleString(),
  "Total actors": numberOfActors.toLocaleString(),
  "Transactions per actor": numberOfTransactionsPerActor.toLocaleString(),
};
console.table(gameInfo);
console.table(Object.fromEntries([
  ...finalActorsSorted.slice(0, 20).map(actor => [actor.name, Math.round(actor.funds).toLocaleString()]),
  [`${numberOfActors - 20} more...`, finalActorsSorted.slice(20, finalActorsSorted.length).reduce((acc, actor) => acc + actor.funds, 0).toFixed(2).toLocaleString()]
]));
