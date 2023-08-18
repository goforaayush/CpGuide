

## Setup frontend

First, run :
```bash
npm install

npm run dev
```

## Setup backend

In another terminal window
```bash
cd backend

```
Setup virtual environment in this directory and activate it
```bash
python -m venv myvenv

#for windows
cd myvenv/Scripts
./Activate.ps1    

#for Mac/Linux
source myvenv/bin/activate
```
After virtual env activated
```bash
pip install -r requirements.txt

```
Go to directory containing manage.py file
```bash
python manage.py loaddata db/questionData.json
python manage.py runserver

```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

1.
<img width="1709" alt="image" src="https://github.com/goforaayush/CpGuide/assets/103204377/cad82ca2-0c40-45b6-a2c1-8b1ffc30b16c">


To know more about what the Website is all about, click on  ```About``` in the NavBar.

2.
<img width="1710" alt="image" src="https://github.com/goforaayush/CpGuide/assets/103204377/90a9e115-6ab1-46d4-91bd-25f89865ad25">


To SignUp, click on the ```SignUp``` button in NavBar.


3a.

<img width="1710" alt="image" src="https://github.com/goforaayush/CpGuide/assets/103204377/91a3dca5-41d2-4498-a7f8-55a0631345f3">


To Login, click on the ```Login``` button in NavBar.

3b.

<img width="1710" alt="image" src="https://github.com/goforaayush/CpGuide/assets/103204377/7c17fd41-ca49-4a96-b74d-85fd7efecbdd">

To view your Profile, click on the ```Profile``` button in NavBar.




4.
<img width="1710" alt="image" src="https://github.com/goforaayush/CpGuide/assets/103204377/cafd9400-c5bf-4ab4-8717-95bab43ee5c8">

Click on ```Solve``` button to get redirected to the question. This will also mark the question to Visited. However, if you still want to mark a question as Unvisited, you can change it to Unvisited by selecting from the Dropdown.
If you wish to make a Note on the question or write any remarks, you can easily do so by clicking on the ```Make a Note``` button. Make sure to click on the ```Save Changes``` button before leaving, to save your note.

5.
<img width="1710" alt="image" src="https://github.com/goforaayush/CpGuide/assets/103204377/2ed69525-da70-4058-97a7-232b27a81ba6">

We have made the App completely responsive to different widths of the screen. This means, it will run flawlessly even on Mobile Phones. So, no worries if you have any OCD issues. We have got you covered.

## For commit messages

```bash
feat:     (addition of a new feature)
refactor: (refactoring the code: optimization/ different logic of existing code - output doesn't change, just the way of execution changes)
docs:     (documenting the code, be it readme, or extra comments)
fix:      (bug fixing)
chore:    (chore - beautifying code, indents, spaces, camelcasing, changing variable names to have an appropriate meaning)
patch:    (patches - small changes in code, mainly UI, for example color of a button, increasing size of tet, etc etc)
conf:     (configurational settings - changing directory structure, updating gitignore, add libraries, changing manifest etc)
```

