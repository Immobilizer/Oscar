import socket
import json
import asyncore
import time
from RPIO import PWM

class EchoHandler(asyncore.dispatcher_with_send):

    def handle_read(self):
        data = self.recv(8192)
        if data:
            try:
                message = json.loads(data)
                print('Incoming message: ', message)
                feedCats()
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

servo = PWM.Servo()

# Servo actuation function
def feedCats():

    # Set servo on GPIO17 to 1600µs (1.6ms)
    servo.set_servo(17, 1600)

    # Run the servo for one second
    time.sleep(1)

    # Clear servo on GPIO17
    servo.stop_servo(17)