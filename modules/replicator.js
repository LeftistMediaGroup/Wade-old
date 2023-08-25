export default class Replicator {
  constructor() {
    console.log(`Replicator Online`);

    console.log(`Machines: ${JSON.stringify(process.env.servers)}`);
  }
}
