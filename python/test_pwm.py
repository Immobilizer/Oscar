from RPIO import PWM
from time import sleep

# This test program sets up the PWM output on GPIO pin 17, and 
# increases the duty cycle of the PWM output until it hits
# the total period (SUBCYCLE_TIME).  Frequency = 1/SUBCYCLE_TIME

SUBCYCLE_TIME = 10000 #in us
PWM_PIN = 17	#as per raspberry pi header
TIME_TO_SLEEP = 1 # in sec
PULSE_TIME_INCREMENT = 50 #in us

# setup LED, change default subcycle time so LED won't flicker
led = PWM.Servo(subcycle_time_us=SUBCYCLE_TIME)
pulse_time = PULSE_TIME_INCREMENT
while pulse_time < SUBCYCLE_TIME:
	led.set_servo(PWM_PIN, pulse_time)
	#pulse_time = pulse_time*2 #exponential growth
	pulse_time = pulse_time + PULSE_TIME_INCREMENT #linear growth
	sleep(TIME_TO_SLEEP)
