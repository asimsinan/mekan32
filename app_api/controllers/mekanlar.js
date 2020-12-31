var mongoose=require('mongoose')
var Mekan=mongoose.model('mekan')
const cevapOlustur=function(res,status,content){
	res
	.status(status)
	.json(content)

}

const mekanlariListele= async(req, res) =>{
    //URL'den enlem ve boylam parametrelerini al
    var boylam= parseFloat(req.query.boylam);
    var enlem = parseFloat(req.query.enlem);
    //alınan bilgilerden nokta tanımla
    var nokta = {
    	type: "Point",
    	coordinates: [enlem,boylam]
    };//coğrafi seçenekleri ekle
    var geoOptions = {
    	distanceField: "mesafe",
    	spherical: true,
    	key:"koordinatlar"
    };
    if (!enlem || !boylam)  {
    	cevapOlustur(res, 404, {
    		"mesaj": "enlem ve boylam zorunlu parametreler"
    	});
    	return; 
    }
    try {
    	const sonuc= await Mekan.aggregate([
    	{
    		$geoNear: {
    			near:nokta,
    			...geoOptions

    		}
    	}
    	]);
    	const mekanlar= sonuc.map(mekan=> { return {
    		_id: mekan._id,
    		ad: mekan.ad,
    		adres: mekan.adres,
    		puan: mekan.puan,
    		imkanlar: mekan.imkanlar,
    		mesafe: mekan.mesafe.toFixed()+'m',				
    	} });

    	cevapOlustur (res, 200, mekanlar);
    }
    catch(e){
    	console.log(e);
    	cevapOlustur (res, 404, e);
    }
}

const mekanEkle= function (req, res) {
	Mekan.create({
		ad: req.body.ad,
		adres: req.body.adres,
		imkanlar: req.body.imkanlar.split(","),
		koordinatlar: [parseFloat(req.body.enlem), parseFloat(req.body.boylam)],
		saatler: [
		{
			gunler: req.body.gunler1,
			acilis: req.body.acilis1,
			kapanis: req.body.kapanis1,
			kapali: req.body.kapali1
		}, {
			gunler: req.body.gunler2,
			acilis: req.body.acilis2,
			kapanis: req.body.kapanis2,
			kapali: req.body.kapali2
		}]
	}, function(hata, mekan) {
		if (hata) {
			cevapOlustur (res, 400, hata);
		} else {
			cevapOlustur (res, 201, mekan);
		}
	});
}


const mekanGuncelle= function (req, res) {
	if (!req.params.mekanid) {
		cevapOlustur(res, 404, {
			"mesaj": "Bulunamadı. mekanid gerekli"});
		return; }
		Mekan
		.findById(req.params.mekanid)
		//- işareti yorumlar ve puan dışında herşeyi almamızı söyler
		.select('-yorumlar -puan')
		.exec(
			function(hata, gelenMekan) {
				if (!gelenMekan) {
					cevapOlustur(res, 404, {"mesaj": "mekanid bulunamadı"});
					return;
				} else if (hata) {
					cevapOlustur(res, 400, hata);
					return; }
					gelenMekan.ad = req.body.ad;
					gelenMekan.adres = req.body.adres;
					gelenMekan.imkanlar = req.body.imkanlar.split(",");
					gelenMekan.mesafe = [parseFloat(req.body.enlem),
					parseFloat(req.body.boylam)];
					gelenMekan.saatler = [{
						gunler: req.body.gunler1,
						acilis: req.body.acilis1,
						kapanis: req.body.kapanis1,
						kapali: req.body.kapali1,
					}, {
						gunler: req.body.gunler2,
						acilis: req.body.acilis2,
						kapanis: req.body.kapanis2,
						kapali: req.body.kapali2,
					}];
					gelenMekan.save(function(hata, mekan) {
						if (hata) {
							cevapOlustur(res, 404,hata);
						} else {
							cevapOlustur(res, 200, mekan);
						}
					});
				}); }

const mekanSil= function (req, res) {

			var mekanid = req.params.mekanid;
			if (mekanid) {
				Mekan
				.findByIdAndRemove(mekanid)
				.exec(
					function(hata, gelenMekan) {
						if (hata) {
							cevapOlustur(res, 404, hata);
							return; 
						}
						cevapOlustur(res, 204,  null);
					}
					);
			} else {
				cevapOlustur(res, 404, {
					"mesaj": "mekanid bulunamadı"
				}); }
			};


const mekanGetir=function(req, res) {
				if(req.params&&req.params.mekanid){
					Mekan.findById(req.params.mekanid)
					.exec(function(hata,mekan){
						if(!mekan){
							cevapOlustur(res,404,{"durum":"mekanid bulunamadı"});
							return;
						}
						else if(hata){
							cevapOlustur(res,404,hata);
						}
						cevapOlustur(res,200,mekan)
					}
					)
				}
				else
					cevapOlustur(res,404,{"durum":"istekte mekanid yok!"})
			}


	module.exports={
				mekanlariListele,
				mekanEkle,
				mekanGetir,
				mekanSil,
				mekanGuncelle
			}