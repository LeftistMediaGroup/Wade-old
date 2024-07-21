export default class Replicator {
  constructor() {
    console.log(`Replicator Online`);

    let servers = [
      process.env.server1,
      process.env.server2,
      process.env.server3,
    ];

    this.aliveServers = [];
    this.self = null;
    this.replications = [];

    this.pingServers = this.pingServers.bind(this);
    this.dataSync = this.dataSync.bind(this);

    this.selfIp = this.identify();

    this.pingServers(servers, this.selfIp, this.dataSync);
  }

  pingServers(servers, self, dataSync) {
    let doneNum = 0;

    servers.forEach((host) => {
      this.hostNum + 1;
    });

    servers.forEach((host) => {
      ping.sys.probe(host, (isAlive) => {
        var msg = isAlive
          ? "host " + host + " is alive"
          : "host " + host + " is dead";
        console.log(msg);

        if (isAlive !== "null" && host !== self) {
          this.aliveServers.push(host);

          console.log(`\nNew Server: ${host}`);
          console.log(
            `ServerList ${JSON.stringify(this.aliveServers, null, 2)}\n`
          );
        }

        doneNum++;
        if (doneNum === servers.length) {
          this.dataSync(this.selfIp);
        }
      });
    });
  }

  identify = () => {
    var interfaces = os.networkInterfaces();
    var addresses = [];
    for (var k in interfaces) {
      for (var k2 in interfaces[k]) {
        var address = interfaces[k][k2];
        if (address.family === "IPv4" && !address.internal) {
          addresses.push(address.address);
        }
      }
    }
    return addresses[1];
  };

  dataSync(self) {
    let replications = [];

    var localDB = new PouchDB(`https://${self}/database/data`);

    for (let database of this.aliveServers) {
      replications.push(
        new PouchDB(`https://${database}/database/data`)
      );
    }

    localDB.sync(new PouchDB(`https://${this.aliveServers[0]}/database/data`), {
      live: true
    }).on('complete', function () {
      console.log(`Worked!`);
    }).on('error', function (err) {
      console.log(`Error: ${err}`);
    });
  }
}
