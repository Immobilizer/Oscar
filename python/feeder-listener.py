import socket
import json
import asyncore
import time
from RPIO import PWM

servo = PWM.Servo()

# Initially set servo on GPIO17 to 700 microseconds (0.7ms)
# This is the 0 degree position
# Give servo one second to reach this position
servo.set_servo(17, 650)
time.sleep(1)
servo.set_servo(17, 700)
time.sleep(0.5)

# Servo actuation function
# Dispense one serving of food when function is called
def feedCats(repeats):
    # # Set servo on GPIO17 to 1600 microseconds (1.6ms)
    # servo.set_servo(17, 1600)
    # # Run the servo for one second
    # time.sleep(5)
    # # Clear servo on GPIO17
    # servo.stop_servo(17)

    while i < repeats:
        # Move ~180 degrees to dispense one serving of cat food
        servo.set_servo(17, 2450)
        time.sleep(1)
        servo.set_servo(17, 2400)
        time.sleep(0.5)
        # Move back ~180 degrees to reload food
        servo.set_servo(17, 650)
        time.sleep(1)
        servo.set_servo(17, 700)
        time.sleep(0.5)

        repeats = repeats + 1

class EchoHandler(asyncore.dispatcher_with_send):

    def handle_read(self):
        data = self.recv(8192)
        if data:
            try:
                message = json.loads(data)
                print('Incoming message: ', message)
                feedCats(2)
            except ValueError:
                print('Decoding JSON has failed!')

class EchoServer(asyncore.dispatcher):

    def __init__(self, host, port):
        asyncore.dispatcher.__init__(self)
        self.create_socket(socket.AF_INET, socket.SOCK_STREAM)
        self.set_reuse_addr()
        self.bind((host, port))
        self.listen(5)

    def handle_accept(self):
        pair = self.accept()
        if pair is None:
            return
        else:
            sock, addr = pair
            print('Incoming connection from %s' % repr(addr))
            handler = EchoHandler(sock)

server = EchoServer('localhost', 50007)
asyncore.loop()
