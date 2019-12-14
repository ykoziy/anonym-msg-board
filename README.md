# Anonymous Message Board
Allows users to create threads and post replies anonymously. Users can delete and report replies/threads. For deletion user must provide a delete password.

------------

#### API Description
|  API | GET | POST  | PUT | DELETE |
| ------------ | -------------- | ---------------- | ----------------- | ------- |
| **/api/threads/{board}** | [list recent threads](#list-recent-threads) | [create thread](#create-thread) | [report thread](#report-thread) | [delete thread with password](#delete-thread) |
|  **/api/replies/{board}** | [show all replies in thread](#show-all-replies-in-thread) | [create reply in thread](#create-reply-in-thread) | [report reply in thread](#report-reply-in-thread) | [change reply to "[deleted]" in thread](#delete-reply)|

#### Live Demo
[project demo](https://ykoziy-anonym-msg-board.glitch.me)

#### API Usage

------------

##### List Recent Threads
GET to `https://ykoziy-anonym-msg-board.glitch.me/api/threads/{board}`
* **{}** - required parameters
* **board** - board name

##### Create Thread
POST to `https://ykoziy-anonym-msg-board.glitch.me/api/threads/{board}`
* **{}** - required parameters
* **board** - board name
With the following data:
	* **text** - thread name (required)
	* **delete_password** - password (required)

##### Report Thread
PUT to `https://ykoziy-anonym-msg-board.glitch.me/api/threads/{board}`
* **{}** - required parameters
* **board** - board name
With the following data:
	* **thread_id** - short thread id (required)

##### Delete Thread
PUT to `https://ykoziy-anonym-msg-board.glitch.me/api/threads/{board}`
* **{}** - required parameters
* **board** - board name
With the following data:
	* **thread_id** - short thread id (required)
	* **delete_password** - password (required)

##### Show All Replies In Thread
GET to `https://ykoziy-anonym-msg-board.glitch.me/api/replies/{board}?thread_id={thread_id}`
* **{}** - required parameters
* **board** - board name
* **thread_id** - short thread id

##### Create Reply In Thread
POST to `https://ykoziy-anonym-msg-board.glitch.me/api/replies/{board}`
* **{}** - required parameters
* **board** - board name
With the following data:
	* **text** - thread name (required)
	* **delete_password** - password (required)
	* **thread_id** - short thread id (required)

##### Report Reply In Thread
PUT to `https://ykoziy-anonym-msg-board.glitch.me/api/replies/{board}`
* **{}** - required parameters
* **board** - board name
With the following data:
	* **reply_id** - short reply id (required)

##### Delete Reply
DELETE to `https://ykoziy-anonym-msg-board.glitch.me/api/replies/{board}`
* **{}** - required parameters
* **board** - board name
With the following data:
	* **delete_password** - password (required)
	* **reply_id** - short reply id (required)
