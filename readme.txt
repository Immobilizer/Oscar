Create an SD Card
	Install Raspbian
		run 'sudo raspi-config'
			Expand the filesystem
			Change the graphics memory to 16MB

Setup Pi for WiFi
	sudo nano /etc/network/interfaces
	change the file so it looks like this
		auto lo

		iface lo inet loopback
		iface eth0 inet dhcp

		allow-hotplug wlan0
		auto wlan0


		iface wlan0 inet dhcp
		        wpa-ssid "ssid"
		        wpa-psk "password"

	if using a 8192cu chipset wifi dongle, create a new file for configuration
		sudo nano /etc/modprobe.d/8192cu.conf
	and add the following lines
		# Disable power management
		options 8192cu rtw_power_mgnt=0 rtw_enusbss=0


Setup node.js
	Download latest pi compatible version of node.js
		sudo wget http://node-arm.herokuapp.com/node_latest_armhf.deb
	Install the package
		sudo dpkg -i node_latest_armhf.deb
	Verify successful installation by checking the node version
		node -v

Clone repository onto the Pi
	Install node modules
		sudo npm install

Install RPIO
	sudo apt-get install python-setuptools
	sudo easy_install -U RPIO

Install a crontab to execute the scripts on pi startup
	sudo crontab -e
	Add the following lines to the end of the file
		@reboot /path/to/npm start /path/to/feederapp/ &
		@reboot python /path/to/feeder/listener/feeder-listener.py &
	The lines on my system look like this
		@reboot /usr/local/bin/npm start /home/pi/git/Oscar/feederapp &
		@reboot python /home/pi/git/Oscar/python/feeder-listener.py &
