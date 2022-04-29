# Dossier_base_server_node
dossier complet, views, data, public, et configurer pour installation node server + express + ejs

# app.js (server node)

```js
// Importation express et router
const express = require("express");
const app = express();
const router = require("./router");
const PORT = process.env.PORT || 3000;

// Configuration du moteur de template EJS
app.set("view engine", "ejs");
// Importation des fichiers statiques
app.set("views", "./views");
app.use(express.static("public"));

// Configuration de la route /
app.use(router);

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

# router.js

```js
// Importations express et router
const express = require("express");
const router = express.Router();

// Exportation du module router
module.exports = router;

// Configuration route /
router.get("/", (req, res) => {
  res.render("index", {
    var1: "Dossier de base",
    var2: "Node.js, Express.js, ejs",
  });
});
```

# index.ejs

```html
<%- include('./partials/header') %>
<h1>Hello, world !</h1>
<p>Hello, <%= var1 %> <%= var2 %></p>
<%- include('./partials/footer') %>
```
