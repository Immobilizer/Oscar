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

# Counter to track position of servo
# 0 degrees is even, 180 degrees is odd
counter = 0

# Food dispensing function, actuates servo
def feedCats(feedCycles):
    
    # Determines how much food the cats get
    i = 0
    while i < feedCycles:

        # if counter is even (servo at 0 degrees)
        if counter % 2 == 0:
            # move to 180 degrees
            servo.set_servo(17, 2450)
            time.sleep(1)
            servo.set_servo(17, 2400)
            time.sleep(0.5)
            # add one to counter
            counter = counter + 1
        # if counter is odd (servo at 180 degrees)
        else :
            # move to 0 degrees
            servo.set_servo(17, 650)
            time.sleep(1)
            servo.set_servo(17, 700)
            time.sleep(0.5)
            # add one to counter
            counter = counter + 1
        i = i + 1

class EchoHandler(asyncore.dispatcher_with_send):

    def handle_read(self):
        data = self.recv(8192)
        if data:
            try:
                message = json.loads(data)
                print('Incoming message: ', message)
                # Feed the cats three feeding cycles worth of food
                feedCats(3)
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
