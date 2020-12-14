var mongoose=require('mongoose')
var Mekan=mongoose.model('mekan')
const cevapOlustur=function(res,status,content){
res
  .status(status)
  .json(content)

}


const yorumEkle=function(req, res) {
 cevapOlustur(res,200,{"durum":"basarili"});
}

const yorumGetir=function(req, res) {
 cevapOlustur(res,200,{"durum":"basarili"});
}

const yorumGuncelle=function(req, res) {
 cevapOlustur(res,200,{"durum":"basarili"});
}

const yorumSil=function(req, res) {
 cevapOlustur(res,200,{"durum":"basarili"});
}

module.exports={
yorumEkle,
yorumGetir,
yorumSil,
yorumGuncelle
}