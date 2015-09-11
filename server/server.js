var Gopigo = require('node-gopigo').Gopigo


var Commands = Gopigo.commands
var Robot = Gopigo.robot

console.log('Gopigo:', Gopigo)
console.log('Commands:', Commands)
console.log('Robot:', Robot)


var robot = new Robot({
  minVoltage: 5.5,
  criticalVoltage: 1.2,
  debug: true,
  ultrasonicSensorPin: 15
})

robot.on('init', function onInit(res) {
  if (res) {
    console.log('GoPiGo ready!')

robot.motion.stop()

/*
    robot.board.wait(1000)
    robot.ledLeft.on()
console.log('ledon')
    robot.board.wait(1000)
    robot.ledRight.on()
console.log('ledon2')
    robot.board.wait(1000)
    robot.motion.forward(false)
console.log('forward')
    robot.board.wait(1000)
    robot.motion.backward(false)
console.log('backward')
    robot.board.wait(1000)
    robot.motion.stop()
console.log('stop')
    robot.board.wait(1000)
    robot.reset()
console.log('reset')
    robot.board.wait(1000)
*/
  } else {
    console.log('Something went wrong during the init.')
  }
})

robot.on('error', function onError(err) {
  console.log('Something went wrong')
  console.log(err)
})

robot.on('free', function onFree() {
  console.log('GoPiGo is free to go')
})
robot.on('halt', function onHalt() {
  console.log('GoPiGo is halted')
})
robot.on('close', function onClose() {
  console.log('GoPiGo is going to sleep')
})
robot.on('reset', function onReset() {
  console.log('GoPiGo is resetting')
})
robot.on('normalVoltage', function onNormalVoltage(voltage) {
  console.log('Voltage is ok ['+voltage+']')
})
robot.on('lowVoltage', function onLowVoltage(voltage) {
  console.log('(!!) Voltage is low ['+voltage+']')
})
robot.on('criticalVoltage', function onCriticalVoltage(voltage) {
  console.log('(!!!) Voltage is critical ['+voltage+']')
})

robot.init()

