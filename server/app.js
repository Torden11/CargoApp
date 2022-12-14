const express = require("express");
const app = express();
const port = 3003;
app.use(express.json({ limit: "10mb" }));
const cors = require("cors");
app.use(cors());
const md5 = require("js-md5");
const uuid = require("uuid");
const mysql = require("mysql");
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "cargoapp",
});

//*******************LOGIN START**********************/
const doAuth = function(req, res, next) {
    if (0 === req.url.indexOf('/server')) { // admin
        const sql = `
        SELECT
        name, role
        FROM users
        WHERE session = ?
    `;
        con.query(
            sql, [req.headers['authorization'] || ''],
            (err, results) => {
                if (err) throw err;
                if (!results.length || results[0].role !== 10) {
                    res.status(401).send({});
                    req.connection.destroy();
                } else {
                    next();
                }
            }
        );
    } else if (0 === req.url.indexOf('/login-check') || 0 === req.url.indexOf('/login') || 0 === req.url.indexOf('/register')) {
        next();
    } else { // fron
        const sql = `
        SELECT
        name, role
        FROM users
        WHERE session = ?
    `;
        con.query(
            sql, [req.headers['authorization'] || ''],
            (err, results) => {
                if (err) throw err;
                if (!results.length) {
                    res.status(401).send({});
                    req.connection.destroy();
                } else {
                    next();
                }
            }
        );
    }
}

app.use(doAuth);

// AUTH
app.get("/login-check", (req, res) => {
    const sql = `
         SELECT
         name, role
         FROM users
         WHERE session = ?
        `;
    con.query(sql, [req.headers['authorization'] || ''], (err, result) => {
        if (err) throw err;
        if (!result.length) {
            res.send({ msg: 'error', status: 1 }); // user not logged
        } else {
            if ('admin' === req.query.role) {
                if (result[0].role !== 10) {
                    res.send({ msg: 'error', status: 2 }); // not an admin
                } else {
                    res.send({ msg: 'ok', status: 3 }); // is admin
                }
            } else {
                res.send({ msg: 'ok', status: 4 }); // is user
            }
        }
    });
});

app.post("/login", (req, res) => {
    const key = uuid.v4();
    const sql = `
    UPDATE users
    SET session = ?
    WHERE name = ? AND psw = ?
  `;
    con.query(sql, [key, req.body.user, md5(req.body.pass)], (err, result) => {
        if (err) throw err;
        if (!result.affectedRows) {
          res.status(401).send({ msg: 'error', key: '' });
        } else {
            res.send({ msg: 'ok', key, text: 'Thanks for coming back ' + req.body.user + ' ! :)', type: 'info' });
        }
    });
});

app.post("/register", (req, res) => {
  const key = uuid.v4();
  const sql = `
  INSERT INTO users (name, psw, session)
  VALUES (?, ?, ?)
`;
  con.query(sql, [req.body.name, md5(req.body.pass), key], (err, result) => {
      if (err) throw err;
      res.send({ msg: 'ok', key, text: 'Welcome!', type: 'info' });
  });
});

//*******************LOGIN END********************/

//CREATE CONTAINERS for admin
// INSERT INTO table_name (column1, column2, column3, ...)
// VALUES (value1, value2, value3, ...);
app.post("/server/containers", (req, res) => {
  const sql = `
    INSERT INTO containers (size, number)
    VALUES (?, ?)
    `;
  con.query(sql, [req.body.size, req.body.number], (err, result) => {
    if (err) throw err;
    res.send({ msg: 'OK', text: 'New container has been added.', type: 'success' });
  });
});

//CREATE BOXES for admin
app.post("/server/boxes", (req, res) => {
  const sql = `
        INSERT INTO boxes (title, weight, flammable, perishable, container_id, image)
        VALUES (?, ?, ?, ?, ?, ?)
        `;
  con.query(
    sql,
    [req.body.title, req.body.weight, req.body.flame, req.body.perish, req.body.container_id, req.body.image],
    (err, result) => {
      if (err) throw err;
      res.send({ msg: 'OK', text: 'New box has been added.', type: 'success' });
    }
  );
});

//READ CONTAINERS for admin
app.get("/server/containers", (req, res) => {
  const sql = `
    SELECT *
    FROM containers
    ORDER BY id DESC
    `;
  con.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});


//READ BOXES for admin
app.get("/server/boxes", (req, res) => {
  const sql = `
        SELECT *
        FROM boxes
        ORDER BY id DESC
        `;
  con.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

//Nuskaitome is dvieju lenteliu HOME for all

app.get("/home/containers", (req, res) => {
  const sql = `
    SELECT c.*, b.id AS bid, b.title, b.weight, b.image, b.flammable, b.perishable
    FROM containers AS c
    LEFT JOIN boxes AS b
    ON b.container_id = c.id
    ORDER BY c.id
    `;
  con.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});



//DELETE CONTAINERS for admin
app.delete("/server/containers/:id", (req, res) => {
  const sql = `
    DELETE FROM containers
    WHERE id = ?
    `;
  con.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.send({ msg: 'OK', text: 'The container has been deleted.', type: 'info' });
  });
});

//DELETE BOXES for admin
app.delete("/server/boxes/:id", (req, res) => {
  const sql = `
    DELETE FROM boxes
    WHERE id = ?
    `;
  con.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.send({ msg: 'OK', text: 'The box has been deleted.', type: 'info' });
  });
});

//UPDATE CONTAINERS for admin
// (kartu padarytas editas su nuotraukos redagavimu)
// UPDATE table_name
// SET column1 = value1, column2 = value2, ...
// WHERE condition;

// app.put("/server/containers/:id", (req, res) => {
//   const sql = `
//     UPDATE containers
//     SET title = ?
//     WHERE id = ?
//     `;
//   con.query(sql, [req.body.title, req.params.id], (err, result) => {
//     if (err) throw err;
//     res.send(result);
//   });
// });

//UPDATE BOXES for admin
app.put("/server/boxes/:id", (req, res) => {
  let sql;
  let request;
  if (req.body.deletePhoto) {
    sql = `
    UPDATE boxes
    SET title = ?, weight = ?, flammable = ?, perishable = ?, container_id = ?, image = null
    WHERE id = ?
    `;
    request = [req.body.title, 
      req.body.weight, 
      req.body.flame, 
      req.body.perish, 
      req.body.container, 
      req.params.id];
  } else if (req.body.image) {
    sql = `
    UPDATE boxes
    SET title = ?, weight = ?, flammable = ?, perishable = ?,container_id = ?, image = ?
    WHERE id = ?
    `;
    request = [
      req.body.title,
      req.body.weight,
      req.body.flame, 
      req.body.perish,
      req.body.container,
      req.body.image,
      req.params.id,
    ];
  } else {
    sql = `
    UPDATE boxes
    SET title = ?, weight = ?, flammable = ?, perishable = ?,container_id = ?
    WHERE id = ?
    `;
    request = [
      req.body.title, 
      req.body.weight, 
      req.body.flame, 
      req.body.perish, 
      req.body.container, 
      req.params.id];
  }

  con.query(sql, request, (err, result) => {
    if (err) throw err;
    res.send({ msg: 'OK', text: 'The box has been edited.', type: 'info' });
  });
});

// app.put("/home/boxes/:id", (req, res) => {
//   const sql = `
//     UPDATE boxes
//     SET 
//     rating_sum = rating_sum + ?, 
//     rating_count = rating_count + 1, 
//     rating = rating_sum / rating_count
//     WHERE id = ?
//     `;
//   con.query(sql, [req.body.rate, req.params.id], (err, result) => {
//     if (err) throw err;
//     res.send({ msg: 'OK', text: 'The box has been edited.', type: 'info' });
//   });
// });

app.listen(port, () => {
  console.log(`Cargo krauna per ${port} port??!`);
});

// //CREATE
// // INSERT INTO table_name (column1, column2, column3, ...)
// // VALUES (value1, value2, value3, ...);
// app.post("/server/suppliers", (req, res) => {
//     const sql = `
//     INSERT INTO electricity_suppliers (title, price)
//     VALUES (?, ?)
//     `;
//     con.query(sql, [req.body.title, req.body.price], (err, result) => {
//         if (err) throw err;
//         res.send(result);
//     });
// });

// app.post("/server/consumers", (req, res) => {
//     const sql = `
//     INSERT INTO electricity_consumers (name, surname, counter_number, supplier_id)
//     VALUES (?, ?, ?, ?)
//     `;
//     con.query(sql, [req.body.name, req.body.surname, req.body.number, req.body.supplier], (err, result) => {
//         if (err) throw err;
//         res.send(result);
//     });
// });

// app.post("/server/bills", (req, res) => {
//     const sql = `
//     INSERT INTO bills (consumer_id, invoice, kwh, total)
//     VALUES (?, ?, ?, ?)
//     `;
//     con.query(sql, [req.body.consumerId, req.body.invoice, req.body.kwh, req.body.total], (err, result) => {
//         if (err) throw err;
//         res.send(result);
//     });
// });

// //READ ALL
// app.get("/server/suppliers", (req, res) => {
//     const sql = `
//     SELECT *
//     FROM electricity_suppliers
//     `;
//     con.query(sql,  (err, result) => {
//         if (err) throw err;
//         res.send(result);
//     });
// });

// app.get("/server/consumers", (req, res) => {
//     const sql = `
//     SELECT *
//     FROM electricity_consumers
//     `;
//     con.query(sql, (err, result) => {
//         if (err) throw err;
//         res.send(result);
//     });
// });

// // app.get("/server/bills", (req, res) => {
// //     const sql = `
// //     SELECT *
// //     FROM bills
// //     `;
// //     con.query(sql, (err, result) => {
// //         if (err) throw err;
// //         res.send(result);
// //     });
// // });

// //Nuskaitome is dvieju lenteliu
// app.get("/server/all", (req, res) => {
//     const sql = `
//     SELECT title, c.*, s.id AS sid, price
//     FROM electricity_suppliers AS s
//     INNER JOIN electricity_consumers AS c
//     ON c.supplier_id = s.id
//     `;
//     con.query(sql, (err, result) => {
//         if (err) throw err;
//         res.send(result);
//     });
// });

// app.get("/server/bills", (req, res) => {
//     const sql = `
//     SELECT b.*, name, surname, title, s.id AS sid
//     FROM bills AS b
//     INNER JOIN electricity_consumers AS c
//     ON b.consumer_id = c.id
//     INNER JOIN electricity_suppliers AS s
//     ON c.supplier_id = s.id
//     `;
//     con.query(sql, (err, result) => {
//         if (err) throw err;
//         res.send(result);
//     });
// });

// //DELETE
// app.delete("/server/suppliers/:id", (req, res) => {
//     const sql = `
//     DELETE FROM electricity_suppliers
//     WHERE id = ?
//     `;
//     con.query(sql, [req.params.id], (err, result) => {
//         if (err) throw err;
//         res.send(result);
//     });
// });

// app.delete("/server/consumers/:id", (req, res) => {
//     const sql = `
//     DELETE FROM electricity_consumers
//     WHERE id = ?
//     `;
//     con.query(sql, [req.params.id], (err, result) => {
//         if (err) throw err;
//         res.send(result);
//     });
// });

// app.delete("/server/bills/:id", (req, res) => {
//     const sql = `
//     DELETE FROM bills
//     WHERE id = ?
//     `;
//     con.query(sql, [req.params.id], (err, result) => {
//         if (err) throw err;
//         res.send(result);
//     });
// });

// //EDIT
// // UPDATE table_name
// // SET column1 = value1, column2 = value2, ...
// // WHERE condition;
// app.put("/server/suppliers/:id", (req, res) => {
//   const sql = `
//   UPDATE electricity_suppliers
//   SET title = ?, price = ?
//   WHERE id = ?
//   `;
//   con.query(sql, [req.body.title, req.body.price, req.params.id], (err, result) => {
//       if (err) throw err;
//       res.send(result);
//   });
// });

// app.put("/server/consumers/:id", (req, res) => {
//     const sql = `
//     UPDATE electricity_consumers
//     SET name = ?, surname = ?, counter_number = ? , supplier_id = ?
//     WHERE id = ?
//     `;
//     console.clear();
//     console.log(req.body, req.params);
//     con.query(sql, [req.body.name, req.body.surname, req.body.number, req.body.supplier, req.params.id], (err, result) => {
//         if (err) throw err;
//         res.send(result);
//     });
//   });

// app.get('/', (req, res) => {
//   res.send('Labas Zebrai')
// });

// app.get('/ate', (req, res) => {
//    res.send('Ate Zebrai')
//  });

// //  *************************PASKAITA 13.09.2022 (023)*************************************
// //READ
// //SELECT column1, column2, ...
// //FROM table_name;
// //pvz WHERE type = 1 OR type = 3
// //WHERE height > 6 AND type = 1
// //DESC -  priesinga tvarka
// //ORDER by type DESC, height
// //WHERE type = ? rasomi kartu su [req.query.tipas]

// //  app.get("/trees", (req, res) => {
//   //ARBA jeigu nori naudoti params
//   // app.get("/trees/:tipas", (req, res) => {
//   // const sql = `
//   // SELECT id, title, type, height
//   // FROM trees
//   // WHERE type = ? OR type = ?

//   // `;

//   //[req.query.tipas] yra dedamas zemiau, o klaustukas virsuje reiskia type=tipas, o tipas yra lygus 1 arba 2 arba 3 is React aplikacijos
//   // ARBA [req.params.tipas]
//   // /?tipas=1 t.y. query, /1 t.y. params. Query yra naudojamas "Kaip rodyti?" arba daugiskaita, params yra rasomas tada kai "Kam yra skirta?"" arba vienaskaita

//   // con.query(sql, [req.query.tipas], (err, result) => {
//   //ARBA jeigu nori naudoti params
//   // con.query(sql, [req.params.tipas], (err, result) => {
//      //ARBA jeigu nori naudoti miksa
// //   con.query(sql, [req.params.tipas, req.query.tipasantras ], (err, result) => {
// //       if (err) throw err;
// //       res.send(result);
// //   });
// // });

// //**************************PASKAITA 20.09.2022 (027)***************/

// //INNER JOIN (bendri duomenys yra abiejose lentelese)
// // SELECT column_name(s)
// // FROM table1
// // INNER JOIN table2
// // ON table1.column_name = table2.column_name;
// //DAZNAI lenteliu pavadinimai yra dideli, todel galima naudoti sutrumpinimus
// //Pasirinkti viska: SELECT *
// //Naudojame 'p.id AS pid' tam kad atvaizduoti telefonu ID, atvaizduodami klientu ID.

// app.get("/get-it/inner-join", (req, res) => {
//   const sql = `

//   SELECT c.id, p.id AS pid, name, phone
//   FROM clients AS c
//   INNER JOIN phones AS p
//   ON c.id = p.client_id
//   `;
//   con.query(sql, (err, result) => {
//       if (err) throw err;
//       res.send(result);
//   });
// });

// //LEFT JOIN (visi duomenys yra is kaires lenteles  + dalis is desines  )
// app.get("/get-it/left-join", (req, res) => {
//   const sql = `

//   SELECT c.id, p.id AS pid, name, phone
//   FROM clients AS c
//   LEFT JOIN phones AS p
//   ON c.id = p.client_id
//   `;
//   con.query(sql, (err, result) => {
//       if (err) throw err;
//       res.send(result);
//   });
// });

// //RIGHT JOIN (visi duomenys yra is desines lenteles  + dalis is kaires  )
// app.get("/get-it/right-join", (req, res) => {
//   const sql = `

//   SELECT c.id, p.id AS pid, name, phone
//   FROM clients AS c
//   RIGHT JOIN phones AS p
//   ON c.id = p.client_id
//   `;
//   con.query(sql, (err, result) => {
//       if (err) throw err;
//       res.send(result);
//   });
// });

// // **************************PASKAITA 19.09.2022 (026)***********************

// // READ (ALL)
// app.get("/trees", (req, res) => {
//     const sql = `
//     SELECT id, type, title, height
//     FROM trees
//     `;
//     con.query(sql, (err, result) => {
//         if (err) throw err;
//         res.send(result);
//     });
// });

// //CREATE
// // INSERT INTO table_name (column1, column2, column3, ...)
// // VALUES (value1, value2, value3, ...);
// app.post("/trees", (req, res) => {
//     const sql = `
//     INSERT INTO trees (title, height, type)
//     VALUES (?, ?, ?)
//     `;
//     con.query(sql, [req.body.title, req.body.height, req.body.type], (err, result) => {
//         if (err) throw err;
//         res.send(result);
//     });
// });

// //DELETE
// // DELETE FROM table_name WHERE condition;
// app.delete("/trees/:id", (req, res) => {
//   const sql = `
//   DELETE FROM trees
//   WHERE id = ?
//   `;
//   con.query(sql, [req.params.id], (err, result) => {
//       if (err) throw err;
//       res.send(result);
//   });
// });

// //EDIT
// // UPDATE table_name
// // SET column1 = value1, column2 = value2, ...
// // WHERE condition;
// app.put("/trees/:id", (req, res) => {
//   const sql = `
//   UPDATE trees
//   SET title = ?, height = ?, type = ?
//   WHERE id = ?
//   `;
//   con.query(sql, [req.body.title, req.body.height, req.body.type, req.params.id], (err, result) => {
//       if (err) throw err;
//       res.send(result);
//   });
// });
