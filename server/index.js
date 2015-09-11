var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// GoPiGo libs
var Gopigo = require('node-gopigo').Gopigo;
var Commands = Gopigo.commands;
var Robot = Gopigo.robot;

var robot = new Robot({
  minVoltage: 5.5,
  criticalVoltage: 1.2,
  debug: true,
  ultrasonicSensorPin: 15
});




robot.on('init', function onInit(res) {
  if (res) {
    console.log('GoPiGo ready!');
    io.emit('status', 'GoPiGo ready for commands');
  }
});

robot.on('error', function onError(err) {
  console.log('Something went wrong');
  console.log(err);
  io.emit('status', 'Error:' + err);
});

robot.on('free', function onFree() {
  console.log('GoPiGo is free to go');
  io.emit('status', 'GoPiGo is free to go');
});

robot.on('halt', function onHalt() {
  console.log('GoPiGo is halted');
  io.emit('status', 'GoPiGo is halted');
});

robot.on('close', function onClose() {
  console.log('GoPiGo is going to sleep');
  io.emit('status', 'GoPiGo is going to sleep');
});

robot.on('reset', function onReset() {
  console.log('GoPiGo is resetting');
  io.emit('status', 'GoPiGo is resetting');
});

robot.on('normalVoltage', function onNormalVoltage(voltage) {
  console.log('Voltage is ok ['+voltage+']');
  io.emit('status', 'Voltage is ok ['+voltage+']');
});

robot.on('lowVoltage', function onLowVoltage(voltage) {
  console.log('(!!) Voltage is low ['+voltage+']');
  io.emit('status', '(!!) Voltage is low ['+voltage+']');
});

robot.on('criticalVoltage', function onCriticalVoltage(voltage) {
  console.log('(!!!) Voltage is critical ['+voltage+']');
  io.emit('status', '(!!!) Voltage is critical ['+voltage+']');
});

robot.init();





app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('command', function(msg){
    switch (msg) {
      case 'help':
        io.emit('status', '')
        io.emit('status', 'reset => performs a reset of LEDs and servo motor')
        io.emit('status', 'left led on => turn left led on')
        io.emit('status', 'left led off => turn left led off')
        io.emit('status', 'right led on => turn right led on')
        io.emit('status', 'right led off => turn right led off')
        io.emit('status', 'move forward => moves the GoPiGo forward')
        io.emit('status', 'move backward => moves the GoPiGo backward')
        io.emit('status', 'turn left => turns the GoPiGo to the left')
        io.emit('status', 'turn right => turns the GoPiGo to the right')
        io.emit('status', 'stop => stops the GoPiGo')
        io.emit('status', 'increase speed => increases the motors speed')
        io.emit('status', 'decrease speed => decreases the motors speed')
        io.emit('status', 'voltage => returns the voltage value')
        io.emit('status', 'servo test => performs a servo test')
        io.emit('status', 'ultrasonic distance => returns the distance from an object')
        io.emit('status', 'move forward with PID => moves the GoPiGo forward with PID')
        io.emit('status', 'move backward with PID => moves the GoPiGo backward with PID')
        io.emit('status', 'rotate left => rotates the GoPiGo to the left')
        io.emit('status', 'rotate right => rotates the GoPiGo to the right')
        io.emit('status', 'set encoder targeting => sets the encoder targeting')
        io.emit('status', 'firmware version => returns the firmware version')
        io.emit('status', 'board revision => returns the board revision')
        io.emit('status', 'ir receive => returns the data from the IR receiver')
        io.emit('status', 'exit => exits from this test')
        io.emit('status', '')
      break
      case 'reset':
        robot.reset()
      break
      case 'left led on':
        var res = robot.ledLeft.on()
        io.emit('status', 'Left led on::'+res)
      break
      case 'left led off':
        var res = robot.ledLeft.off()
        io.emit('status', 'Left led off::'+res)
      break
      case 'right led on':
        var res = robot.ledRight.on()
        io.emit('status', 'Right led on::'+res)
      break
      case 'right led off':
        var res = robot.ledRight.off()
        io.emit('status', 'Right led off::'+res)
      break
      case 'move forward':
      case 'w':
        var res = robot.motion.forward(false)
        io.emit('status', 'Moving forward::' + res)
      break
      case 'turn left':
      case 'a':
        var res = robot.motion.left()
        io.emit('status', 'Turning left::' + res)
      break
      case 'turn right':
      case 'd':
        var res = robot.motion.right()
        io.emit('status', 'Turning right::' + res)
      break
      case 'move backward':
      case 's':
        var res = robot.motion.backward(false)
        io.emit('status', 'Moving backward::' + res)
      break
      case 'stop':
      case 'x':
        var res = robot.motion.stop()
        io.emit('status', 'Stop::' + res)
      break
      case 'increase speed':
      case 't':
        var res = robot.motion.increaseSpeed()
        io.emit('status', 'Increasing speed::' + res)
      break
      case 'decrease speed':
      case 'g':
        var res = robot.motion.decreaseSpeed()
        io.emit('status', 'Decreasing speed::' + res)
      break
      case 'voltage':
      case 'v':
        var res = robot.board.getVoltage()
        io.emit('status', 'Voltage::' + res + ' V')
      break
      case 'servo test':
      case 'b':
        robot.servo.move(0)
        io.emit('status', 'Servo in position 0')

        robot.board.wait(1000)
        robot.servo.move(180)
        io.emit('status', 'Servo in position 180')

        robot.board.wait(1000)
        robot.servo.move(90)
        io.emit('status', 'Servo in position 90')
      break
      case 'exit':
      case 'z':
        robot.close()
        process.exit()
      break
      case 'ultrasonic distance':
      case 'u':
        var res = robot.ultraSonicSensor.getDistance()
        io.emit('status', 'Ultrasonic Distance::' + res + ' cm')
      break
      case 'ir receive':
        var res = robot.IRReceiverSensor.read()
        io.emit('status', 'IR Receiver data::')
        io.emit('status', res)
      break
      case 'l':
        // TODO
      break
      case 'move forward with pid':
      case 'i':
        var res = robot.motion.forward(true)
        io.emit('status', 'Moving forward::' + res)
      break
      case 'move backward with pid':
      case 'k':
        var res = robot.motion.backward(true)
        io.emit('status', 'Moving backward::' + res)
      break
      case 'rotate left':
      case 'n':
        var res = robot.motion.leftWithRotation()
        io.emit('status', 'Rotating left::' + res)
      break
      case 'rotate right':
      case 'm':
        var res = robot.motion.rightWithRotation()
        io.emit('status', 'Rotating right::' + res)
      break
      case 'set encoder targeting':
      case 'y':
        var res = robot.encoders.targeting(1, 1, 18)
        io.emit('status', 'Setting encoder targeting:1:1:18::' + res)
      break
      case 'firmware version':
      case 'f':
        var res = robot.board.version()
        io.emit('status', 'Firmware version::' + res)
      break
      case 'board revision':
        var res = robot.board.revision()
        io.emit('status', 'Board revision::' + res)
      break
  }
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
