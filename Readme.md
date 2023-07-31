## Online Orders Hub
```
Note: This project was made for personal use and for a specific use case only. As such there are no testcases or clear documentations.
```
### Background
- It was made for a restaurant where I worked part time as a cashier and the POS system they used was very old.
- The online orders would come in fax and email after a while and during busy hours we would miss to put the online orders in the system and we would only know once the customer come to pickup the food.

### Approach
- Read the mail periodically i.e every 2 minutes in this case using background worker i.e django-huey in this approach.
- Add the orders in the database and server it using an API.
- Display some basic stats and the online orders in the frontend that was built using react.
- Also have some confirmation option to confirm that the order was indeed added to the POS system.

### Tools and Frameworks Used
    Frontend
        - React as base frontend framework
        - TailwindCSS for CSS
        - ReactQuery for API Integration
        - HeadlessUI for Reactivity
    Backend
        - Django as base backend framework
        - Django-Ninja for API
        - Django-Huey for background tasks
        - Imap tools for reading emails
    Database and Queues
        - Postgresql as Database
        - Redis as queue for django-huey
    Deploy
        - Nginx as rerverse proxy
        - Docker for deployment

### Screenshots

### Sample Order

![Order Mail](/assets/screenshots/OrderFormat.png)

#### Login
![Login](/assets/screenshots/Login.png)

#### New Order
![New Order](/assets/screenshots/PendingOrder.png)
*Force pull if you want to trigger email read yourself*

#### Check New Order
![Check New Orders](/assets/screenshots/ViewPendingOrder.png)

#### Add the Pending Order to POS System
![Add To POS](/assets/screenshots/AddtoPOS.png)

#### Post Adding of Orders
![Post Add](/assets/screenshots/PostAdd.png)

#### Dashboard
![Dash](/assets/screenshots/Dashboard.png)


#### Possible Future Steps [Not Sure]
- Add html files that comes in the mail as a file type and store it so one can cross check and verify proper parsing
- Add a link in the UI under name `Invoice` that show that html file in a pop-up for new tab