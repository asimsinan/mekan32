var express = require('express');
var router = express.Router();
var ctrlMekanlar=require('../controllers/mekanlar');
var ctrlYorumlar=require('../controllers/yorumlar');

router
.route('/mekanlar')
.get(ctrlMekanlar.mekanlariListele)
.post(ctrlMekanlar.mekanEkle);

router
.route('/mekanlar/:mekanid')
.get(ctrlMekanlar.mekanGetir)
.put(ctrlMekanlar.mekanGuncelle)
.delete(ctrlMekanlar.mekanSil);

router
.route('/mekanlar/:mekanid/yorumlar')
.post(ctrlYorumlar.yorumEkle)

router
.route('/mekanlar/:mekanid/yorumlar/:yorumid')
.get(ctrlYorumlar.yorumGetir)
.put(ctrlYorumlar.yorumGuncelle)
.delete(ctrlYorumlar.yorumSil);

module.exports = router;
