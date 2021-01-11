var request = require('postman-request');
var apiSecenekleri = {
  sunucu : "http://localhost:3000",
  apiYolu: '/api/mekanlar/',
  adminYolu: '/api/admin/'
}
var istekSecenekleri
var footer="Asım Sinan Yüksel 2020"
var mesafeyiFormatla = function (mesafe) {
  var yeniMesafe, birim;
  if (mesafe> 1000) {
    yeniMesafe= parseFloat(mesafe/1000).toFixed(1);
    birim = ' km';
  } else {
    yeniMesafe = parseFloat(mesafe).toFixed(1);
    birim = ' m'; 
  }
    return yeniMesafe + birim;
  }

  var anaSayfaOlustur = function(req, res,cevap, mekanListesi){
  var mesaj;
//Gelen mekanListesi eğer dizi tipinde değilse hata ver.
if (!(mekanListesi instanceof Array)) {
  mesaj = "API HATASI: Birşeyler ters gitti";
  mekanListesi = [];
} else {//Eğer belirlenen mesafe içinde mekan bulunamadıysa bilgilendir
  if (!mekanListesi.length) {
    mesaj = "Civarda Herhangi Bir Mekan Bulunamadı!";
  }
}
res.render('mekanlar-liste', 
  { 
  baslik: 'MekanBul-Yakınındaki Mekanları Bul',
  sayfaBaslik:{
    siteAd:'MekanBul',
    aciklama:'Yakınınızda Kafeleri, Restorantları Bulun!'
  },
  footer:footer,
  mekanlar:mekanListesi,
  mesaj: mesaj,
  cevap:cevap
});
}

const anaSayfa=function(req,res){
    istekSecenekleri = 
    {//tam yol
    url : apiSecenekleri.sunucu + apiSecenekleri.apiYolu,
    //Veri çekeceğimiz için GET metodunu kullan
    method : "GET",
    //Dönen veri json formatında olacak
    json : {},
    //Sorgu parametreleri.URL'de yazılan enlem boylamı al
    //localhost:3000/?enlem=37&boylam=30 gibi
    qs : {
      enlem :  req.query.enlem,
      boylam : req.query.boylam
    }
  };//istekte bulun
  request(
    istekSecenekleri,
    //geri dönüş metodu
    function(hata, cevap, mekanlar) {
      var i, gelenMekanlar;
      gelenMekanlar = mekanlar;
      //Sadece 200 durum kodunda ve mekanlar doluyken işlem yap
      if (!hata && gelenMekanlar.length) {
        for (i=0; i<gelenMekanlar.length; i++) {
          gelenMekanlar[i].mesafe = 
          mesafeyiFormatla(gelenMekanlar[i].mesafe);
        }
      }
      anaSayfaOlustur(req, res, cevap,gelenMekanlar);
    } 
  );
}

var adminSayfaOlustur = function(req, res,mekanListesi){
  var mesaj;
//Gelen mekanListesi eğer dizi tipinde değilse hata ver.
if (!(mekanListesi instanceof Array)) {
  mesaj = "API HATASI";
  mekanListesi = [];
} else {
  //Eğer belirlenen mesafe içinde mekan bulunamadıysa bilgilendir
  if (!mekanListesi.length) {
    mesaj = "Herhangi Bir Mekan Bulunamadı!";
  }
}

res.render('admin', { baslik: 'MekanBul-Admin',
  sayfaBaslik:{
    siteAd:'MekanBul-Admin',
    aciklama:'Mekanları Yönetin'
  },
  mekanlar:mekanListesi,
  mesaj: mesaj,
  footer:footer
});
};

const adminSayfa = function(req, res){
  //istek seçeneklerini ayarla.
  istekSecenekleri = {
    //tam yol
    url : apiSecenekleri.sunucu + apiSecenekleri.adminYolu,
    //Veri çekeceğimiz için GET metodunu kullan
    method : "GET",
    //Dönen veri json formatında olacak
    json : {},
  };//istekte bulun
  request(
    istekSecenekleri,
    //geri dönüş metodu
    function(hata, cevap, mekanlar) {
      adminSayfaOlustur(req, res,mekanlar);
    }
    ); 
}
var detaySayfasiOlustur = function(req, res,mekanDetaylari){
 res.render('mekan-detay', 
 { 
  baslik: mekanDetaylari.ad,
  footer:footer,
  sayfaBaslik: mekanDetaylari.ad,
  mekanBilgisi:mekanDetaylari
});
}
var hataGoster = function(req, res,durum){
  var baslik,icerik;
  if(durum==404){
    baslik="404, Sayfa Bulunamadı!";
    icerik="Kusura bakma sayfayı bulamadık!";
  }
  else{
     baslik=durum+", Birşeyler ters gitti!";
     icerik="Ters giden birşey var!";
  }
 res.status(durum);
 res.render('error',{
    baslik:baslik,
    icerik:icerik
 });
}

var mekanBilgisiGetir = function (req, res, callback) {
  //istek seçeneklerini ayarla.
  istekSecenekleri = {
    //tam yol
    url : apiSecenekleri.sunucu + apiSecenekleri.apiYolu + req.params.mekanid,
    //Veri çekeceğimiz için GET metodunu kullan
    method : "GET",
    //Dönen veri json formatında olacak
    json : {}
  };//istekte bulun
  request(
    istekSecenekleri,
    //geri dönüş metodu
    function(hata, cevap, mekanDetaylari) {
      var gelenMekan = mekanDetaylari;
      //mesaj kısmının var olmaması mekanın bulunduğuna işarettir.
      //eğer olmayan bir id ye sorgu yapılırsa hata mesajının içeriği dolacaktır.
      if (!cevap.body.mesaj) {

        //enlem ve boylam bir dizi şeklinde bunu ayır. 
        //0'da enlem 1 de boylam var
        gelenMekan.koordinatlar = {
          enlem : mekanDetaylari.koordinatlar[0],
          boylam : mekanDetaylari.koordinatlar[1]
        };
        callback(req, res,gelenMekan);

      } else {
        hataGoster(req, res, cevap.statusCode);
      }
    }
    ); 
};
const mekanBilgisi = function (req, res, callback) {
  mekanBilgisiGetir(req, res, function(req, res, cevap) {
   detaySayfasiOlustur(req, res, cevap);
 });
};
var yorumSayfasiOlustur = function (req, res, mekanBilgisi) {
  res.render('yorum-ekle', { baslik: mekanBilgisi.ad+ ' Mekanına Yorum Ekle',
    sayfaBaslik:mekanBilgisi.ad+ ' Mekanına Yorum Ekle' ,
    hata: req.query.hata,
    footer:footer
  });
};
//yorumEkle controller metodu
//index.js dosyasındaki router.get('/mekan/:mekanid/yorum/yeni', ctrlMekanlar.yorumEkle);
//ile metot url'ye bağlanıyor
const yorumEkle=function(req,res){
  mekanBilgisiGetir(req, res, function(req, res, cevap) {
   yorumSayfasiOlustur(req, res, cevap);
 });
}
const yorumumuEkle = function(req, res){
  var gonderilenYorum,mekanid;
  mekanid=req.params.mekanid;
  gonderilenYorum = {
    yorumYapan: req.body.name,
    puan: parseInt(req.body.rating, 10),
    yorumMetni: req.body.review
  };
  istekSecenekleri = {
    url : apiSecenekleri.sunucu+ apiSecenekleri.apiYolu+mekanid+'/yorumlar',
    method : "POST",
    json : gonderilenYorum
  };
  if (!gonderilenYorum.yorumYapan || !gonderilenYorum.puan || !gonderilenYorum.yorumMetni) {
    res.redirect('/mekan/' + mekanid + '/yorum/yeni?hata=evet'); 
  } else { 
    request(
      istekSecenekleri,
      function(hata, cevap, body) {
        if (cevap.statusCode === 201) {
          res.redirect('/mekan/' + mekanid);
        } 
        else if (cevap.statusCode === 400 && body.name && body.name ==="ValidationError" ) {
          res.redirect('/mekan/' + mekanid + '/yorum/yeni?hata=evet'); 
        }
        else {
          hataGoster(req, res, cevap.statusCode);
        } 
      }
      );
    }
  };

var mekanEkleSayfasiOlustur = function (req, res) {
  res.render('mekan-ekle', { 
    baslik:' Yeni Mekan Ekle',
    sayfaBaslik:' Yeni Mekan Ekle',
    hata: req.query.hata,
    footer:footer
  });
};
var mekanGuncelleSayfasiOlustur = function (req, res,mekanBilgisi) {
  res.render('mekan-guncelle', {
    baslik: mekanBilgisi.ad+ ' Mekanını Güncelle',
    sayfaBaslik:mekanBilgisi.ad+ ' Mekanını Güncelle' ,
    mekanBilgisi:mekanBilgisi,
    hata: req.query.hata,
    footer:footer
  });
}
const mekanEkle = function(req, res){
   mekanEkleSayfasiOlustur(req, res);
};
const mekanGuncelle = function(req, res){
  mekanBilgisiGetir(req, res, function(req, res, cevap) {
    var imkan=cevap.imkanlar[0];
     for (i=1; i<cevap.imkanlar.length; i++) {
          imkan =imkan+","+cevap.imkanlar[i];
        }
    cevap.imkanlar=imkan;
   mekanGuncelleSayfasiOlustur(req, res, cevap);
 });
};
const mekaniGuncelle = function(req, res){
  var gonderilenMekan,mekanid;
  mekanid = req.params.mekanid;
  gonderilenMekan = {
    ad: req.body.mekanAdi,
    adres: req.body.mekanAdresi,
    imkanlar: req.body.imkanlar,
    enlem: req.body.enlem,
    boylam:req.body.boylam,
    gunler1: req.body.gunler1,
    acilis1: req.body.acilis1,
    kapanis1: req.body.kapanis1,
    kapali1: 'false',
    gunler2: req.body.gunler2,
    acilis2: req.body.acilis2,
    kapanis2: req.body.kapanis2,
    kapali2:'false'
  };
  istekSecenekleri = {
    url : apiSecenekleri.sunucu+ apiSecenekleri.apiYolu+mekanid,
    method : "PUT",
    json : gonderilenMekan
  };
  if (!gonderilenMekan.ad || !gonderilenMekan.adres || !gonderilenMekan.imkanlar|| !gonderilenMekan.acilis1|| !gonderilenMekan.kapanis1|| !gonderilenMekan.gunler1|| !gonderilenMekan.gunler2|| !gonderilenMekan.acilis2|| !gonderilenMekan.kapanis2) {
    res.redirect('/admin/mekan/yeni?hata=evet');  
  } else { 
    request(
      istekSecenekleri,
      function(hata, cevap, body) {
        if (!hata) {
          res.redirect('/admin');
        } 
        else if (hata && body.ad && body.adres && body.imkanlar&& body.gunler1&& body.acilis1&& body.kapanis1&& body.gunler2&& body.acilis2&& body.kapanis2 ==="ValidationError" ) {
          res.redirect('/admin/mekan/yeni?hata=evet'); 
        }
        else {
          hataGoster(req, res, cevap.statusCode);
        } 
      }
      );
    }
  }
const mekaniEkle = function(req, res){
  var gonderilenMekan;
  gonderilenMekan = {
    ad: req.body.mekanAdi,
    adres: req.body.mekanAdresi,
    imkanlar: req.body.imkanlar,
    enlem: req.body.enlem,
    boylam: req.body.boylam,
    gunler1: req.body.gunler1,
    acilis1: req.body.acilis1,
    kapanis1: req.body.kapanis1,
    kapali1: 'false',
    gunler2: req.body.gunler2,
    acilis2: req.body.acilis2,
    kapanis2: req.body.kapanis2,
    kapali2:'false'
  };
  istekSecenekleri = {
    url : apiSecenekleri.sunucu+ apiSecenekleri.apiYolu,
    method : "POST",
    json : gonderilenMekan
  };
  if (!gonderilenMekan.ad || !gonderilenMekan.adres || !gonderilenMekan.imkanlar|| !gonderilenMekan.acilis1|| !gonderilenMekan.kapanis1|| !gonderilenMekan.gunler1|| !gonderilenMekan.gunler2|| !gonderilenMekan.acilis2|| !gonderilenMekan.kapanis2) {
    res.redirect('/admin/mekan/yeni?hata=evet');  
  } else { 
    request(
      istekSecenekleri,
      function(hata, cevap, body) {
        if (!hata) {
          res.redirect('/admin');
        } 
        else if (cevap.statusCode === 400 && body.ad && body.adres && body.imkanlar&& body.gunler1&& body.acilis1&& body.kapanis1&& body.gunler2&& body.acilis2&& body.kapanis2 ==="ValidationError" ) {
          res.redirect('/admin/mekan/yeni?hata=evet'); 
        }
        else {
          hataGoster(req, res, cevap.statusCode);
        } 
      }
      );
    }
  }
const mekanSil= function(req, res){
  var mekanid;
  mekanid = req.params.mekanid;
  istekSecenekleri = {
    url : apiSecenekleri.sunucu+ apiSecenekleri.apiYolu+mekanid,
    method : "DELETE",
    json : {}
  };
    request(
      istekSecenekleri,
      function(hata, cevap, body) {
        if (!hata) {
          res.redirect('/admin/');
        } 
        else if (hata) {
          hataGoster(req, res, cevap.statusCode); 
        }
      }
      );
}
module.exports={
anaSayfa,
adminSayfa,
mekanBilgisi,
mekanEkle,
mekaniEkle,
mekanGuncelle,
mekaniGuncelle,
mekanSil,
yorumEkle,
yorumumuEkle
}