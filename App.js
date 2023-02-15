const express = require("express");
const app = express();
const port = 3000
const mysql = require("./connection").con
    // configuration
app.set("view engine", "hbs");
app.set("views", "./view")
app.use(express.static(__dirname + "/public"))

// app.use(express.urlencoded())
// app.use(express.json())
// Routing
app.get("/", (req, res) => {
    res.render("index")
});
app.get("/add", (req, res) => {
    res.render("add")

});
app.get("/search", (req, res) => {
    res.render("search")

});
app.get("/update", (req, res) => {
    res.render("update")

});

app.get("/delete", (req, res) => {
    res.render("delete")

});
app.get("/view", (req, res) => {
    let qry = "select * from student ";
    mysql.query(qry, (err, results) => {
        if (err) throw err
        else {
            res.render("view", { data: results });
        }

    });

});


app.get("/addcustomer", (req, res) => {
    // fetching data from form
    const { name, accountno, phone, emailid, amount, address, gender } = req.query

    // Sanitization XSS...
    let qry = "select * from student where emailid=? or phone=?";
    mysql.query(qry, [emailid, phone], (err, results) => {
        if (err)
            throw err
        else {

            if (results.length > 0) {
                res.render("add", { checkmesg: true })
            } else {

                // insert query
                let qry2 = "insert into student values(?,?,?,?,?,?,?)";
                mysql.query(qry2, [name,accountno, phone, emailid, amount, address, gender], (err, results) => {
                    if (results.affectedRows > 0) {
                        res.render("add", { mesg: true })
                    }
                })
            }
        }
    })
});


app.get("/searchcustomer", (req, res) => {
    // fetch data from the form


    const { phone } = req.query;

    let qry = "select * from student where phone=?";
    mysql.query(qry, [phone], (err, results) => {
        if (err) throw err
        else {
            if (results.length > 0) {
                res.render("search", { mesg1: true, mesg2: false })
            } else {

                res.render("search", { mesg1: false, mesg2: true })

            }

        }
    });
})

app.get("/updatesearch", (req, res) => {

    const { phone } = req.query;

    let qry = "select * from student where phone=?";
    mysql.query(qry, [phone], (err, results) => {
        if (err) throw err
        else {
            if (results.length > 0) {
                res.render("update", { mesg1: true, mesg2: false, data: results })
            } else {

                res.render("update", { mesg1: false, mesg2: true })

            }

        }
    });
})
app.get("/updatecustomer", (req, res) => {
    // fetch data

    const { phone, name, gender ,emailid,amount,address} = req.query;
    let qry = "update student set name=?, gender=?,emailid=?,amount=amount+?,address=? where phone=?";

    mysql.query(qry, [name, gender,emailid,amount,address, phone], (err, results) => {
        if (err) throw err
        else {
            if (results.affectedRows > 0) {
                res.render("update", { umesg: true })
            }
        }
    })

});

app.get("/removecustomer", (req, res) => {

    // fetch data from the form


    const { phone } = req.query;

    let qry = "delete from student where phone=?";
    mysql.query(qry, [phone], (err, results) => {
        if (err) throw err
        else {
            if (results.affectedRows > 0) {
                res.render("delete", { mesg1: true, mesg2: false })
            } else {

                res.render("delete", { mesg1: false, mesg2: true })

            }

        }
    });
});
//Create Server
app.listen(port, (err) => {
    if (err)
        throw err
    else
        console.log("Server is running at port %d:", port);
});