const express = require('express');
const {Deta} = require('deta');
const cors = require('cors')
const bcrypt = require('bcryptjs');
const {isLnurl, decodeLnurl} = require('./lnurl.js');
const nocache = require('nocache');
const path = require("path");
require('dotenv').config();

const deta = Deta(process.env.PROJECT_KEY);
const db = deta.Base('lnAddresses');

const app = express();

app.use(express.json());
app.use(nocache());
app.use(cors());
app.use(express.static(path.join(__dirname, './dist')));

app.post('/new', async (req, res) => {
    const {alias, lnurl, secret} = req.body;
    if (!alias || !lnurl || !secret) {
        res.status(400).json({"message": "Missing alias, lnurl, or password"});
        return;
    }
    if (alias.length > 20) {
        res.status(400).json({"message": "Alias is too long. Max length is 20 characters."});
        return;
    }
    if (lnurl.length > 800) {
        res.status(400).json({"message": "LNURL is too long. Max length is 800 characters."});
        return;
    }
    if (secret.length > 128) {
        res.status(400).json({"message": "Password is too long. Max length is 128 characters."});
        return;
    }
    if (!alias.match(/^\w+/)) {
        res.status(400).json({"message": "Alias can only contain letters, numbers, and underscores."});
        return;
    }

    const hash = bcrypt.hashSync(secret, bcrypt.genSaltSync(10));

    if (!isLnurl(lnurl)) {
        res.status(400).json({"message": "Not valid LNURLp"});
        return;
    } else {
        try {
            await (await fetch(decodeLnurl(lnurl))).json()
        } catch (e) {
            res.status(400).json({"message": "LNURLp server unreachable"});
            return;
        }
    }
    if (!(await db.fetch({"alias": alias})).items[0]) {
        const toCreate = {alias, lnurl, hash};
        await db.put(toCreate);
        res.status(201).json({"message": "Address created", "address": `${alias}@${req.get("host")}`});
    } else {
        res.status(400).json({"message": "Alias already exists"});
    }
});

app.get('/.well-known/lnurlp/:alias', async (req, res) => {
    const {alias} = req.params;
    const user = (await db.fetch({"alias": alias})).items[0];
    if (user) {
        try {
            res.json(await (await fetch(decodeLnurl(user.lnurl))).json());
        } catch (e) {
            res.status(400).json({"message": "Could not reach LNURLp server"});
        }
    } else {
        res.status(404).json({"message": "user not found"});
    }
});

app.put('/update/:alias/:secret', async (req, res) => {
    const {alias, secret} = req.params;
    const user = (await db.fetch({"alias": alias})).items[0];

    if (user && bcrypt.compareSync(secret, user.hash)) {
        let {newAlias, newLnurl, newSecret} = req.body;
        newLnurl = newLnurl ? newLnurl : user.lnurl;
        if (!newAlias || !newLnurl || !newSecret) {
            res.status(400).json({"message": "Missing newAlias, newLnurl, or newPassword"});
            return;
        }
        if (newAlias.length > 20) {
            res.status(400).json({"message": "New alias is too long. Max length is 20 characters."});
            return;
        }
        if (newLnurl.length > 400) {
            res.status(400).json({"message": "New LNURL is too long. Max length is 400 characters."});
            return;
        }
        if (newSecret.length > 128) {
            res.status(400).json({"message": "New Password is too long. Max length is 128 characters."});
            return;
        }
        if (!newAlias.match(/^\w+/)) {
            res.status(400).json({"message": "Alias can only contain letters, numbers, and underscores."});
            return;
        }

        const newHash = bcrypt.hashSync(newSecret, bcrypt.genSaltSync(10));
        const toPut = {"alias": newAlias ?? alias, "lnurl": newLnurl ?? user.lnurl, "hash": newHash ?? user.hash};
        await db.put(toPut);
        await db.delete(user.key);
        res.status(200).json({"message": "success", "address": `${newAlias}@${req.get("host")}`});
    } else {
        res.status(401).json({"message": "unauthorized"});
    }
});

app.delete('/delete/:alias/:secret', async (req, res) => {
    const {alias, secret} = req.params;
    if (!alias || !secret) {
        res.status(400).json({"message": "Missing alias or password"});
        return;
    }

    const user = (await db.fetch({"alias": alias})).items[0];
    if (!user) {
        res.status(404).json({"message": "User not found"});
        return;
    }

    if (user && bcrypt.compareSync(secret, user.hash)) {
        await db.delete(user.key);
        res.status(200).json({"message": "deleted"})
    } else {
        res.status(401).json({"message": "unauthorized"});
    }
});

//dev

app.get("/backup", async (req, res) => {
    let resa = await db.fetch();
    let allItems = resa.items;

    while (resa.last){
        resa = await db.fetch({}, {last: resa.last});
        allItems = allItems.concat(resa.items);
    }
    console.log(allItems, allItems.length);
    res.status(200).send(`OK ${allItems.length} items saved`);
});

app.listen(3002, () => {
    console.log('Server listening on port 3002');
});




//deploy
/*
module.exports = app;
*/
