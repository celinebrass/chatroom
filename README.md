# chatroom
NodeJS api written to teach CUAppDev training program about interacting with APIs from iOS

Install Instructions : 

1.Install NodeJs from https://nodejs.org/en/download/stable/
  
    Note: Use “Stable”--should be version 5.10
  
2.Install NPM at version 2.14.15 with `$ npm install npm@2.14.15 -g`
  
    Note: A later version was installed along with Node--we are installing an older version

3.Install MongoDB from https://www.mongodb.org/downloads?_ga=1.170177510.737348932.1458420296#production

    -Expand the download file
    -Move it to wherever you want to store it on your computer
    -Rename the folder “mongodb”
  
4.Clone the Chatroom application with `$ git clone https://github.com/celinebrass/chatroom.git`

5. Go into the Chatroom directory you just cloned and run the following commands

    `$ npm install`
    
    `$ mkdir data`
  
6.In a SEPARATE teminal window, navigate to ~<PATH>/mongodb/bin (wherever you stored your mongo installation) and run `./mongod --dbpath ~/<PATH TO DATA FOLDER YOU JUST CREATED IN STEP 5b>`
    
    Example: `$ ./mongod --dbpath ~/CUAPPDev/chatroom/data`

7.From your original terminal window, run `$ npm start`

You should now have a running server.  Check to see if it worked by navigating to localhost:3000 in your browser.  You should see a success message.
