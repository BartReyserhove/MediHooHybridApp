To be able to run our application, you will need to do several things.

Precondition: This project is a hybrid-application using ionic. Make sure you have nodejs and npm installed on your pc.
		Next you'll need to run following command: npm install -g cordova ionic
		For more information over nodejs: https://nodejs.org/,
		npm: https://www.npmjs.com/,
		ionic: http://ionicframework.com/

Step one: Clone the repo from Bitbucket, I will assume this won't be a problem.
		https://github.com/capoli/MediHooHybridApp.git


Step two: Navigate to the root folder with your commandline tool and run "npm install". This should install all nodeJS dependencies for the project. After that run "bower install".


Step three: You'll need to install the correct platform in the project in order to run it. To do so, execute the following commands in the root folder in your commandline tool:
	-> ionic platform add ios
	-> ionic build ios
Replace "ios" with "android" if you want to add android. I will assume you can set up an android/ios emulator without this readme.



Step four: You'll need to install all the plugins ionic needs for the application with your commandline. Navigate to the root folder and run the following commands:
	-> ionic state restore
	
	this command will install following plugins:
	com.ionic.keyboard, org.apache.cordova.console, org.apache.cordova.device, org.apache.cordova.inappbrowser, org.apache.cordova.statusbar,...

	

NOTE: Due to a problem in our repo that may or may not be fixed, it's possible half-installed versions of these plugins are already in the project. Run "Ionic plugin remove *plugin here*" to remove them first if this is the case.


Step seven: To run the app navigate to the root folder and execute the following command:
To run in iOS emulator: ionic emulate ios
To run in android emulator: ionic emulate android
To run in genymotion: ionic run android (make sure your emulator is running beforehand)

If all went well, the app should install itself on your emulator of choice and launch. 

For questions contact Olivier Cappelle,
same goes for any suggestions for improvements on this readme/configuration process.
