const { Counter, register, Gauge, Histogram } = require('prom-client')
module.exports.prometheusMetrics = {
  commandLatency: new Histogram({
    name: 'ritsu_command_latency',
    help: 'Command Latency',
    labelNames: ['name'],
  }),
  commandCounter: new Counter({
    name: 'ritsu_command_counter',
    help: 'Command Counter',
    labelNames: ['name'],
  }),
  matchStarted: new Gauge({
    name: 'ritsu_matches_started',
    help: 'Matches created.',
  }),
  errorCounter: new Counter({
    name: 'ritsu_error_counter',
    help: 'Number of errors occurred.',
  }),
  serversJoined: new Gauge({
    name: 'ritsu_joined_servers',
    help: 'Servers that Ritsu joined.',
  }),
  ramUsage: new Gauge({
    name: 'ritsu_ram_usage',
    help: 'Memory usage.',
  }),
  cpuUsage: new Gauge({
    name: 'ritsu_cpu_usage',
    help: 'CPU Usage',
  }),
  ping: new Gauge({
    name: 'ritsu_ping',
    help: 'Ritsu Ping',
  }),
  messagesSeen: new Counter({
    name: 'ritsu_messages_seen',
    help: 'Messages Seen',
  }),
  register,
}
