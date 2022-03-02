const express = require('express');
const dec = require('querystring');
var router = express.Router();
const mongoose = require('mongoose');
const Employee = mongoose.model('Employee');

router.get('/', (req, res) => {
    res.render("employee/addOrEdit", {
        viewTitle: "Insert Employee"
    });
});

router.post('/employee/:id', (req, res) => {
    updateRecord(req, res);
});

router.post('/employee/', (req, res) => {
    insertRecord(req, res);
});

function insertRecord(req, res) {
    var employee = new Employee();
    employee.fullName = req.body.fullName;
    employee.email = req.body.email;
    employee.mobile = req.body.mobile;
    employee.city = req.body.city;
    employee.salary = req.body.salary;
    employee.job = req.body.job;
    employee.save((err, doc) => {
        if (!err)
            res.redirect('/list');
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("employee/addOrEdit", {
                    viewTitle: "Insert Employee",
                    employee: req.body
                });
            }
            else
                console.log("Erreur lors de l'insertion des données : " + err);
        }
    });
}

function updateRecord(req, res) {
    Employee.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) { res.redirect('/list'); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("employee/addOrEdit", {
                    viewTitle: 'Update Employee',
                    employee: req.body
                });
            }
            else
                console.log("Erreur lors de la mise à jour des données :" + err);
        }
    });
}

router.get('/list', (req, res) => {
    Employee.find({}).lean().then(employee => { res.render("employee/list", {
        list: employee
    })});
});


function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'fullName':
                body['fullNameError'] = err.errors[field].message;
                break;
            case 'email':
                body['emailError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}



router.get('/employee/:id', (req, res) => {
    //Employee.find({_id: req.params.id}).lean().then(employeex => { console.log(employeex)});
    Employee.find({_id: req.params.id}).lean().then(employeex => { res.render("employee/Edit", {
        employee: employeex
    })});
});


router.get('/employee/delete/:id', (req, res) => {
    Employee.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/list');
        }
        else { console.log("Erreur lors de la suppression de l'employé :" + err); }
    });
});

module.exports = router;