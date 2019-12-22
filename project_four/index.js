const express = require("express");
const dbOperations = require("./database");
const queryExecutor = dbOperations.queryExecutor;
const schedule = require("node-schedule");
const path = require("path");

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, "./front_end/build")));

app.get("/goals", (req, res) => {
  res.redirect("/");
});

app.get("/board", (req, res) => {
  res.redirect("/");
});

app.get("/register", (req, res) => {
  res.redirect("/");
});

app.get("/login", (req, res) => {
  res.redirect("/");
});

// Login - Register
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const query = `select * from users_t where(user_name='${username}' and password='${password}');`;
  queryExecutor(query)
    .then(data => {
      console.log(data);
      if (data.length == 1) {
        const { id, user_name, email } = data[0];
        return res.json({ id, user_name, email });
      }

      res.sendStatus(401);
    })
    .catch(e => {
      console.log(e);
    });
});

app.post("/register", (req, res) => {
  const { username, email, password } = req.body;
  const insertQuery = dbOperations.insertQuery(
    "users_t",
    ["user_name", "email", "password"],
    [username, email, password]
  );

  dbOperations
    .checkIfUserExist(username, password)
    .then(doesUserExist => {
      if (!doesUserExist) {
        queryExecutor(insertQuery)
          .then(() => res.sendStatus(200))
          .catch(e => res.sendStatus(500));
      } else {
        res.sendStatus(409);
      }
    })
    .catch(e => res.sendStatus(500));
});

// Goals

app.post("/createGoal/:userId", (req, res) => {
  const { userId } = req.params;
  const { name, reason, description, status } = req.body;
  query = `insert into goals (user_id, name, reason, description, status)
      values (${userId}, '${name}','${reason}', '${description}', '${status}');
  `;

  queryExecutor(query)
    .then(data => {
      console.log(data);
      res.sendStatus(200);
    })
    .catch(e => {
      res.sendStatus(500);
    });
});

app.get("/goals/:userId", (req, res) => {
  const { userId } = req.params;
  const query = `select * from goals where (user_id=${userId});`;
  queryExecutor(query)
    .then(data => {
      res.json(data);
    })
    .catch(e => {
      console.log(e);
    });
});

app.get("/goals/:userId/:searchTerm", (req, res) => {
  let { userId, searchTerm } = req.params;
  const query = `select * from goals where (user_id=${userId});`;

  queryExecutor(query)
    .then(data => {
      const filteredGoals = data.filter(goal => {
        searchTerm = searchTerm.toLowerCase();
        const goalName = goal.name.toLowerCase();
        return goalName.includes(searchTerm);
      });

      res.json(filteredGoals);
    })
    .catch(e => res.sendStatus(500));
});

app.put("/goals/:goalId", (req, res) => {
  const { goalId } = req.params;
  const { name, reason, description, status } = req.body;

  const query = `update goals set name='${name}', reason='${reason}',description='${description}',status='${status}' where id=${goalId};`;
  queryExecutor(query)
    .then(data => {
      console.log(data);
      res.sendStatus(200);
    })
    .catch(e => {
      res.sendStatus(500);
    });
});

app.delete("/goals/:goalId", (req, res) => {
  const { goalId } = req.params;
  const query = `delete from goals where id = ${goalId};`;
  taskQuery = `delete from tasks where goal_id=${goalId}`;
  queryExecutor(taskQuery).then(() => {
    queryExecutor(query)
      .then(() => {
        res.sendStatus(200);
      })
      .catch(e => {
        res.sendStatus(500);
      });
  });
});

// Tasks

app.post("/createTask/:goalId", (req, res) => {
  const { goalId } = req.params;
  const { name, description, status } = req.body;
  query = `insert into tasks (goal_id, name, description, status)
      values (${goalId}, '${name}', '${description}', '${status}');
  `;
  queryExecutor(query)
    .then(data => {
      console.log(data);
      res.sendStatus(200);
    })
    .catch(e => {
      res.sendStatus(500);
    });
});

app.get("/tasks/:goalId", (req, res) => {
  const { goalId } = req.params;
  const query = `select * from tasks where (goal_id=${goalId});`;
  queryExecutor(query)
    .then(data => {
      res.json(data);
      console.log("success");
    })
    .catch(e => {
      console.log(e);
    });
});

app.put("/tasks/:taskId", (req, res) => {
  const { taskId } = req.params;
  const { newBody } = req.body;
  const name = newBody.title;
  const description = newBody.description;
  const status = newBody.status;

  query = `update tasks set name='${name}', description='${description}', status='${status}' where id=${taskId};`;
  queryExecutor(query)
    .then(data => {
      console.log(data);
      res.sendStatus(200);
    })
    .catch(e => {
      res.sendStatus(500);
    });
});

app.delete("/tasks/:taskId", (req, res) => {
  const { taskId } = req.params;
  query = `delete from tasks where id = ${taskId};`;
  queryExecutor(query)
    .then(() => {
      res.sendStatus(200);
    })
    .catch(e => {
      res.sendStatus(500);
    });
});

app.get("/completed/goals/:userId", (req, res) => {
  const { userId } = req.params;
  query = `select * from goals where user_id=${userId} and status='complete'`;
  queryExecutor(query).then(data =>
    res.json(data).catch(e => res.sendStatus(500))
  );
});

// run everyday at midnight
// Reset tasks to "in complete" for all users
schedule.scheduleJob("0 0 * * *", () => {
  const query = "update tasks set status= 'in complete';";
  queryExecutor(query).then(() => console.log("Tasks updated"));
});

app.listen(5000, () => console.log("server is running"));
