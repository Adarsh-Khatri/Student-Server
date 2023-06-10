let express = require("express");
require('dotenv').config();
const PORT = process.env.PORT || 2410;

let app = express();
app.use(express.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD");
    res.header("Access-Control-Allo-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

app.listen(PORT, () => console.log(`Listening on port http://localhost/${PORT}`))

let { studentsData } = require('./studentsData');
let fs = require('fs');
let fileName = 'students.json';

app.get('/svr/resetData', (req, res) => {
    let data = JSON.stringify(studentsData);
    fs.writeFile(fileName, data, (err) => {
        if (err) res.status(404).send(err)
        else res.send('DATA IN FILE IS RESET');
    })
})


app.get('/svr/students', (req, res) => {
    fs.readFile(fileName, 'utf-8', (err, data) => {
        if (err) res.status(404).send(err)
        else {
            let studentsArr = JSON.parse(data)
            res.send(studentsArr)
        };
    })
})

app.get('/svr/students/:id', (req, res) => {
    let { id } = req.params;
    fs.readFile(fileName, 'utf-8', (err, data) => {
        if (err) res.status(404).send(err)
        else {
            let studentsArr = JSON.parse(data)
            let student = studentsArr.find(st => st.id === (+id))
            if (student) res.send(student)
            else res.status(404).send(`NO STUDENT FOUND WITH ID ${id}`)
        };
    })
})


app.get('/svr/students/course/:name', (req, res) => {
    let { name } = req.params;
    fs.readFile(fileName, 'utf-8', (err, data) => {
        if (err) res.status(404).send(err)
        else {
            let studentsArr = JSON.parse(data)
            let courseArr = studentsArr.filter(st => st.course === name)
            res.send(courseArr)
        };
    })
})


app.post('/svr/students', (req, res) => {
    fs.readFile(fileName, 'utf-8', (err, data) => {
        if (err) res.status(404).send(err)
        else {
            let studentsArr = JSON.parse(data)
            let maxId = studentsArr.reduce((acc, cur) => cur.id > acc ? cur.id : acc, 0);
            let newId = maxId + 1;
            let newStudent = { id: newId, ...req.body };
            studentsArr.push(newStudent)
            let data1 = JSON.stringify(studentsArr)
            fs.writeFile(fileName, data1, (err) => {
                if (err) res.status(404).send(err)
                else res.send(newStudent);
            })
        }
    })
})

app.put('/svr/students/:id', (req, res) => {
    let { id } = req.params;
    fs.readFile(fileName, 'utf-8', (err, data) => {
        if (err) res.status(404).send(err)
        else {
            let studentsArr = JSON.parse(data)
            let index = studentsArr.findIndex(st => st.id === (+id))
            if (index >= 0) {
                let updatedStudent = { ...studentsArr[index], ...req.body }
                studentsArr[index] = updatedStudent;
                let data1 = JSON.stringify(studentsArr)
                fs.writeFile(fileName, data1, (err) => {
                    if (err) res.status(404).send(err)
                    else res.send(updatedStudent);
                })
            }
            else res.status(404).send("NO STUDENT FOUND")
        }
    })
})


app.delete('/svr/students/:id', (req, res) => {
    let { id } = req.params;
    fs.readFile(fileName, 'utf-8', (err, data) => {
        if (err) res.status(404).send(err)
        else {
            let studentsArr = JSON.parse(data)
            let index = studentsArr.findIndex(st => st.id === (+id))
            if (index >= 0) {
                let deletedStudent = studentsArr.splice(index, 1)
                let data1 = JSON.stringify(studentsArr)
                fs.writeFile(fileName, data1, (err) => {
                    if (err) res.status(404).send(err)
                    else res.send(deletedStudent);
                })
            }
            else res.status(404).send("NO STUDENT FOUND")
        }
    })
})