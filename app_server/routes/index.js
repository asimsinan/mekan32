var express = require('express');
var router = express.Router();
var ctrlMekanlar=require('../controllers/mekanlar');
var ctrlDigerleri=require('../controllers/digerleri');

router.get('/', ctrlMekanlar.anaSayfa);
router.get('/mekan/:mekanid', ctrlMekanlar.mekanBilgisi);
router.get('/mekan/:mekanid/yorum/yeni', ctrlMekanlar.yorumEkle);
router.get('/hakkinda', ctrlDigerleri.hakkinda);
router.post('/mekan/:mekanid/yorum/yeni', ctrlMekanlar.yorumumuEkle); 

router.get('/admin', ctrlMekanlar.adminSayfa);
router.get('/admin/mekan/yeni', ctrlMekanlar.mekanEkle);
//Mekanı ekle tuşunun çağıracağı metodun rotası
router.post('/admin/mekan/yeni', ctrlMekanlar.mekaniEkle);
//Mekan sil tuşunun çağıracağı metodun rotası
router.get('/admin/mekan/:mekanid/sil', ctrlMekanlar.mekanSil);
//Mekanı güncelleme sayfasının rotatı
router.get('/admin/mekan/:mekanid/guncelle', ctrlMekanlar.mekanGuncelle);
//Mekanı güncelle tuşunun çağıracağı metodun rotası
router.post('/admin/mekan/:mekanid/guncelle', ctrlMekanlar.mekaniGuncelle);

module.exports = router;
