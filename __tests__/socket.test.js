const { createServer } = require('http');
const { Server } = require('socket.io');
const Client = require('socket.io-client');

describe('WebSocket Connection', () => {
  let io, clientSocket, serverSocket;

  beforeAll((done) => {
    const httpServer = createServer();
    io = new Server(httpServer);

    io.on('connection', socket => {
      serverSocket = socket;
    });

    httpServer.listen(() => {
      const port = httpServer.address().port;
      clientSocket = new Client(`http://localhost:${port}`);
      clientSocket.on('connect', done);
    });
  })

  afterAll(() => {
    io.close();
    clientSocket.close();
  })

  test('should work', (done) => {
    clientSocket.on('hello', (arg) => {
      expect(arg).toBe('world');
      done();
    });

    serverSocket.emit('hello', 'world');
  })

  test('should work 2', (done) => {
    clientSocket.on('hello', (arg) => {
      expect(arg).toBe('world');
      done();
    });

    serverSocket.emit('hello', 'world');
  })
})