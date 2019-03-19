var fs = require('fs');
var modbus = require('jsmodbus');
var PubNub = require('pubnub');
try{
var secPubNub=60*4 + 55;
var BottleSorterct = null,
    BottleSorterresults = null,
    CntOutBottleSorter = null,
    BottleSorteractual = 0,
    BottleSortertime = 0,
    BottleSortersec = 0,
    BottleSorterflagStopped = false,
    BottleSorterstate = 0,
    BottleSorterspeed = 0,
    BottleSorterspeedTemp = 0,
    BottleSorterflagPrint = 0,
    BottleSortersecStop = 0,
    BottleSorterdeltaRejected = null,
    BottleSorterONS = false,
    BottleSortertimeStop = 60, //NOTE: Timestop
    BottleSorterWorktime = 0.99, //NOTE: Intervalo de tiempo en minutos para actualizar el log
    BottleSorterflagRunning = false,
    CntRejBottleSorter=null;
var Fillerct = null,
    Fillerresults = null,
    CntInFiller = null,
    CntOutFiller = null,
    Filleractual = 0,
    Fillertime = 0,
    Fillersec = 0,
    FillerflagStopped = false,
    Fillerstate = 0,
    Fillerspeed = 0,
    FillerspeedTemp = 0,
    FillerflagPrint = 0,
    FillersecStop = 0,
    FillerdeltaRejected = null,
    FillerONS = false,
    FillertimeStop = 60, //NOTE: Timestop
    FillerWorktime = 0.99, //NOTE: Intervalo de tiempo en minutos para actualizar el log
    FillerflagRunning = false,
    FillerRejectFlag = false,
    FillerReject,
    FillerVerify = (function(){
      try{
        FillerReject = fs.readFileSync('FillerRejected.json')
        if(FillerReject.toString().indexOf('}') > 0 && FillerReject.toString().indexOf('{\"rejected\":') != -1){
          FillerReject = JSON.parse(FillerReject)
        }else{
          throw 12121212
        }
      }catch(err){
        if(err.code == 'ENOENT' || err == 12121212){
          fs.writeFileSync('FillerRejected.json','{"rejected":0}') //NOTE: Change the object to what it usually is.
          FillerReject = {
            rejected : 0
          }
        }
      }
    })();
var CapSupplyct = null,
    CapSupplyresults = null,
    CntOutCapSupply = null,
    CapSupplyactual = 0,
    CapSupplytime = 0,
    CapSupplysec = 0,
    CapSupplyflagStopped = false,
    CapSupplystate = 0,
    CapSupplyspeed = 0,
    CapSupplyspeedTemp = 0,
    CapSupplyflagPrint = 0,
    CapSupplysecStop = 0,
    CapSupplydeltaRejected = null,
    CapSupplyONS = false,
    CapSupplytimeStop = 60, //NOTE: Timestop
    CapSupplyWorktime = 0.99, //NOTE: Intervalo de tiempo en minutos para actualizar el log
    CapSupplyflagRunning = false;
var Depuckerct = null,
    Depuckerresults = null,
    CntInDepucker = null,
    CntOutDepucker = null,
    Depuckeractual = 0,
    Depuckertime = 0,
    Depuckersec = 0,
    DepuckerflagStopped = false,
    Depuckerstate = 0,
    Depuckerspeed = 0,
    DepuckerspeedTemp = 0,
    DepuckerflagPrint = 0,
    DepuckersecStop = 0,
    DepuckerdeltaRejected = null,
    DepuckerONS = false,
    DepuckertimeStop = 60, //NOTE: Timestop
    DepuckerWorktime = 0.99, //NOTE: Intervalo de tiempo en minutos para actualizar el log
    DepuckerflagRunning = false;
var Capperct = null,
    Capperresults = null,
    CntInCapper = null,
    CntOutCapper = null,
    Capperactual = 0,
    Cappertime = 0,
    Cappersec = 0,
    CapperflagStopped = false,
    Capperstate = 0,
    Capperspeed = 0,
    CapperspeedTemp = 0,
    CapperflagPrint = 0,
    CappersecStop = 0,
    CapperdeltaRejected = null,
    CapperONS = false,
    CappertimeStop = 60, //NOTE: Timestop
    CapperWorktime = 0.99, //NOTE: Intervalo de tiempo en minutos para actualizar el log
    CapperflagRunning = false,
    CapperRejectFlag = false,
    CapperReject,
    CapperVerify = (function(){
      try{
        CapperReject = fs.readFileSync('CapperRejected.json')
        if(CapperReject.toString().indexOf('}') > 0 && CapperReject.toString().indexOf('{\"rejected\":') != -1){
          CapperReject = JSON.parse(CapperReject)
        }else{
          throw 12121212
        }
      }catch(err){
        if(err.code == 'ENOENT' || err == 12121212){
          fs.writeFileSync('CapperRejected.json','{"rejected":0}') //NOTE: Change the object to what it usually is.
          CapperReject = {
            rejected : 0
          }
        }
      }
    })();
var Labelerct = null,
    Labelerresults = null,
    CntInLabeler = null,
    CntOutLabeler = null,
    Labeleractual = 0,
    Labelertime = 0,
    Labelersec = 0,
    LabelerflagStopped = false,
    Labelerstate = 0,
    Labelerspeed = 0,
    LabelerspeedTemp = 0,
    LabelerflagPrint = 0,
    LabelersecStop = 0,
    LabelerdeltaRejected = null,
    LabelerONS = false,
    LabelertimeStop = 60, //NOTE: Timestop
    LabelerWorktime = 0.99, //NOTE: Intervalo de tiempo en minutos para actualizar el log
    LabelerflagRunning = false,
    LabelerRejectFlag = false,
    LabelerReject,
    LabelerVerify = (function(){
      try{
        LabelerReject = fs.readFileSync('LabelerRejected.json')
        if(LabelerReject.toString().indexOf('}') > 0 && LabelerReject.toString().indexOf('{\"rejected\":') != -1){
          LabelerReject = JSON.parse(LabelerReject)
        }else{
          throw 12121212
        }
      }catch(err){
        if(err.code == 'ENOENT' || err == 12121212){
          fs.writeFileSync('LabelerRejected.json','{"rejected":0}') //NOTE: Change the object to what it usually is.
          LabelerReject = {
            rejected : 0
          }
        }
      }
    })();
var ManualPackingct = null,
    ManualPackingresults = null,
    CntInManualPacking = null,
    ManualPackingactual = 0,
    ManualPackingtime = 0,
    ManualPackingsec = 0,
    ManualPackingflagStopped = false,
    ManualPackingstate = 0,
    ManualPackingspeed = 0,
    ManualPackingspeedTemp = 0,
    ManualPackingflagPrint = 0,
    ManualPackingsecStop = 0,
    ManualPackingdeltaRejected = null,
    ManualPackingONS = false,
    ManualPackingtimeStop = 60, //NOTE: Timestop
    ManualPackingWorktime = 0.99, //NOTE: Intervalo de tiempo en minutos para actualizar el log
    ManualPackingflagRunning = false;
var CaseFormerct = null,
    CaseFormerresults = null,
    CntOutCaseFormer = null,
    CaseFormeractual = 0,
    CaseFormertime = 0,
    CaseFormersec = 0,
    CaseFormerflagStopped = false,
    CaseFormerstate = 0,
    CaseFormerspeed = 0,
    CaseFormerspeedTemp = 0,
    CaseFormerflagPrint = 0,
    CaseFormersecStop = 0,
    CaseFormerdeltaRejected = null,
    CaseFormerONS = false,
    CaseFormertimeStop = 60, //NOTE: Timestop
    CaseFormerWorktime = 0.99, //NOTE: Intervalo de tiempo en minutos para actualizar el log
    CaseFormerflagRunning = false;
var CasePackerct = null,
    CasePackerresults = null,
    CntInCasePacker = null,
    CntOutCasePacker = null,
    CasePackeractual = 0,
    CasePackertime = 0,
    CasePackersec = 0,
    CasePackerflagStopped = false,
    CasePackerstate = 0,
    CasePackerspeed = 0,
    CasePackerspeedTemp = 0,
    CasePackerflagPrint = 0,
    CasePackersecStop = 0,
    CasePackerdeltaRejected = null,
    CasePackerONS = false,
    CasePackertimeStop = 60, //NOTE: Timestop
    CasePackerWorktime = 0.99, //NOTE: Intervalo de tiempo en minutos para actualizar el log
    CasePackerflagRunning = false;
var CntOutEOL=null,
    secEOL= 0;
var CntOutEOLManualPacking=null,
    secEOLManualPacking= 0;
var publishConfig;
var intId1,intId2,intId3;
var files = fs.readdirSync("C:/PULSE/L8_LOGS/"); //Leer documentos
var text2send=[];//Vector a enviar
var i=0;
var pubnub = new PubNub({
  publishKey:		"pub-c-8d024e5b-23bc-4ce8-ab68-b39b00347dfb",
subscribeKey: 		"sub-c-c3b3aa54-b44b-11e7-895e-c6a8ff6a3d85",
  uuid: "CUE_PCL_LINE8"
});

var senderData = function (){
  pubnub.publish(publishConfig, function(status, response) {
});}

var client1 = modbus.client.tcp.complete({
  'host': "192.168.10.99",
  'port': 502,
  'autoReconnect': true,
  'timeout': 60000,
  'logEnabled': true,
  'reconnectTimeout' : 30000
});
var client2 = modbus.client.tcp.complete({
  'host': "192.168.10.100",
  'port': 502,
  'autoReconnect': true,
  'timeout': 60000,
  'logEnabled': true,
  'reconnectTimeout' : 30000
});
var client3 = modbus.client.tcp.complete({
  'host': "192.168.10.101",
  'port': 502,
  'autoReconnect': true,
  'timeout': 60000,
  'logEnabled': true,
  'reconnectTimeout' : 30000
});
}catch(err){
    fs.appendFileSync("error_declarations.log",err + '\n');
}
try{
  client1.connect();
  client2.connect();
  client3.connect();
}catch(err){
  fs.appendFileSync("error_connection.log",err + '\n');
}

try{
  /*----------------------------------------------------------------------------------Funcction-------------------------------------------------------------------------------------------*/

  var joinWord=function(num1, num2) {
    var bits = "00000000000000000000000000000000";
    var bin1 = num1.toString(2),
      bin2 = num2.toString(2),
      newNum = bits.split("");

    for (i = 0; i < bin1.length; i++) {
      newNum[31 - i] = bin1[(bin1.length - 1) - i];
    }
    for (i = 0; i < bin2.length; i++) {
      newNum[15 - i] = bin2[(bin2.length - 1) - i];
    }
    bits = newNum.join("");
    return parseInt(bits, 2);
  };
//PubNub --------------------------------------------------------------------------------------------------------------------
       setInterval(function() {
       	if(secPubNub>=60*5){

          var idle=function(){
            i=0;
            text2send=[];
            for (var k=0;k<files.length;k++){//Verificar los archivos
              var stats = fs.statSync("C:/PULSE/L8_LOGS/"+files[k]);
              var mtime = new Date(stats.mtime).getTime();
              if (mtime< (Date.now() - (15*60*1000))&&files[k].indexOf("serialbox")==-1){
                flagInfo2Send=1;
                text2send[i]=files[k];
                i++;
              }
            }
          };
          idle();
          secPubNub=0;
          publishConfig = {
            channel : "Cue_PCL_Monitor",
            message : {
                  line: "8",
                  tt: Date.now(),
                  machines:text2send

                }
          };
          senderData();
        }
        secPubNub++;
    }, 1000);
//PubNub --------------------------------------------------------------------------------------------------------------------


client1.on('connect', function(err) {
  intId1 =
    setInterval(function(){
        client1.readHoldingRegisters(0, 16).then(function(resp) {
          WaitFiller =  joinWord(resp.register[0], resp.register[1]);
          CntOutFiller =  joinWord(resp.register[2], resp.register[3]);
          CntInDepucker =  joinWord(resp.register[2], resp.register[3]);
          CntInFiller =  joinWord(resp.register[4], resp.register[5]);
          CntOutBottleSorter =  joinWord(resp.register[6], resp.register[7]);
          CntRejBottleSorter =  joinWord(resp.register[8], resp.register[9]);
        //------------------------------------------BottleSorter----------------------------------------------
              BottleSorterct = CntOutBottleSorter // NOTE: igualar al contador de salida
              if (!BottleSorterONS && BottleSorterct) {
                BottleSorterspeedTemp = BottleSorterct
                BottleSortersec = Date.now()
                BottleSorterONS = true
                BottleSortertime = Date.now()
              }
              if(BottleSorterct > BottleSorteractual){
                if(BottleSorterflagStopped){
                  BottleSorterspeed = BottleSorterct - BottleSorterspeedTemp
                  BottleSorterspeedTemp = BottleSorterct
                  BottleSortersec = Date.now()
                  BottleSorterdeltaRejected = null
                  BottleSorterRejectFlag = false
                  BottleSortertime = Date.now()
                }
                BottleSortersecStop = 0
                BottleSorterstate = 1
                BottleSorterflagStopped = false
                BottleSorterflagRunning = true
              } else if( BottleSorterct == BottleSorteractual ){
                if(BottleSortersecStop == 0){
                  BottleSortertime = Date.now()
                  BottleSortersecStop = Date.now()
                }
                if( ( Date.now() - ( BottleSortertimeStop * 1000 ) ) >= BottleSortersecStop ){
                  BottleSorterspeed = 0
                  BottleSorterstate = 2
                  BottleSorterspeedTemp = BottleSorterct
                  BottleSorterflagStopped = true
                  BottleSorterflagRunning = false
                  BottleSorterflagPrint = 1
                }
              }
              BottleSorteractual = BottleSorterct
              if(Date.now() - 60000 * BottleSorterWorktime >= BottleSortersec && BottleSortersecStop == 0){
                if(BottleSorterflagRunning && BottleSorterct){
                  BottleSorterflagPrint = 1
                  BottleSortersecStop = 0
                  BottleSorterspeed = BottleSorterct - BottleSorterspeedTemp
                  BottleSorterspeedTemp = BottleSorterct
                  BottleSortersec = Date.now()
                }
              }
              BottleSorterresults = {
                ST: BottleSorterstate,
                CPQI : CntOutBottleSorter + CntRejBottleSorter,
                CPQO : CntOutBottleSorter,
                CPQR : CntRejBottleSorter,
                SP: BottleSorterspeed
              }
              if (BottleSorterflagPrint == 1) {
                for (var key in BottleSorterresults) {
                  if( BottleSorterresults[key] != null && ! isNaN(BottleSorterresults[key]) )
                  //NOTE: Cambiar path
                  fs.appendFileSync('C:/PULSE/L8_LOGS/mex_pcl_BottleSorter_L8.log', 'tt=' + BottleSortertime + ',var=' + key + ',val=' + BottleSorterresults[key] + '\n')
                }
                BottleSorterflagPrint = 0
                BottleSortersecStop = 0
                BottleSortertime = Date.now()
              }
        //------------------------------------------BottleSorter----------------------------------------------
        //------------------------------------------Filler----------------------------------------------
              Fillerct = CntOutFiller // NOTE: igualar al contador de salida
              if (!FillerONS && Fillerct) {
                FillerspeedTemp = Fillerct
                Fillersec = Date.now()
                FillerONS = true
                Fillertime = Date.now()
              }
              if(Fillerct > Filleractual){
                if(FillerflagStopped){
                  Fillerspeed = Fillerct - FillerspeedTemp
                  FillerspeedTemp = Fillerct
                  Fillersec = Date.now()
                  FillerdeltaRejected = null
                  FillerRejectFlag = false
                  Fillertime = Date.now()
                }
                FillersecStop = 0
                Fillerstate = 1
                FillerflagStopped = false
                FillerflagRunning = true
              } else if( Fillerct == Filleractual ){
                if(FillersecStop == 0){
                  Fillertime = Date.now()
                  FillersecStop = Date.now()
                }
                if( ( Date.now() - ( FillertimeStop * 1000 ) ) >= FillersecStop ){
                  Fillerspeed = 0
                  Fillerstate = 2
                  FillerspeedTemp = Fillerct
                  FillerflagStopped = true
                  FillerflagRunning = false
                  FillerflagPrint = 1
                }
              }
              Filleractual = Fillerct
              if(Date.now() - 60000 * FillerWorktime >= Fillersec && FillersecStop == 0){
                if(FillerflagRunning && Fillerct){
                  FillerflagPrint = 1
                  FillersecStop = 0
                  Fillerspeed = Fillerct - FillerspeedTemp
                  FillerspeedTemp = Fillerct
                  Fillersec = Date.now()
                }
              }
              Fillerresults = {
                ST: Fillerstate,
                CPQI : CntInFiller,
                CPQO : CntOutFiller,
                //CPQR : FillerdeltaRejected,
                SP: Fillerspeed
              }
              if (FillerflagPrint == 1) {
                for (var key in Fillerresults) {
                  if( Fillerresults[key] != null && ! isNaN(Fillerresults[key]) )
                  //NOTE: Cambiar path
                  fs.appendFileSync('C:/PULSE/L8_LOGS/mex_pcl_Filler_L8.log', 'tt=' + Fillertime + ',var=' + key + ',val=' + Fillerresults[key] + '\n')
                }
                FillerflagPrint = 0
                FillersecStop = 0
                Fillertime = Date.now()
              }
        //------------------------------------------Filler----------------------------------------------

        });//Cierre de lectura
      },1000);
  });//Cierre de cliente

  client1.on('error', function(err){
    clearInterval(intId1);
  });
  client1.on('close', function() {
  	clearInterval(intId1);
  });

client2.on('connect', function(err) {
          intId2 = setInterval(function(){
              client2.readHoldingRegisters(0, 16).then(function(resp) {
                CntOutCapSupply    = joinWord(resp.register[0], resp.register[1]);
                CntOutDepucker    = joinWord(resp.register[2], resp.register[3]);
                CntOutCapper    = joinWord(resp.register[4], resp.register[5]);
                CntInLabeler    = joinWord(resp.register[6], resp.register[7]);
                CntInCapper    = joinWord(resp.register[8], resp.register[9]);
                CntOutEOLManualPacking= joinWord(resp.register[12], resp.register[13]);
        //------------------------------------------Depucker----------------------------------------------
              Depuckerct = CntOutDepucker // NOTE: igualar al contador de salida
              if (!DepuckerONS && Depuckerct) {
                DepuckerspeedTemp = Depuckerct
                Depuckersec = Date.now()
                DepuckerONS = true
                Depuckertime = Date.now()
              }
              if(Depuckerct > Depuckeractual){
                if(DepuckerflagStopped){
                  Depuckerspeed = Depuckerct - DepuckerspeedTemp
                  DepuckerspeedTemp = Depuckerct
                  Depuckersec = Date.now()
                  DepuckerdeltaRejected = null
                  DepuckerRejectFlag = false
                  Depuckertime = Date.now()
                }
                DepuckersecStop = 0
                Depuckerstate = 1
                DepuckerflagStopped = false
                DepuckerflagRunning = true
              } else if( Depuckerct == Depuckeractual ){
                if(DepuckersecStop == 0){
                  Depuckertime = Date.now()
                  DepuckersecStop = Date.now()
                }
                if( ( Date.now() - ( DepuckertimeStop * 1000 ) ) >= DepuckersecStop ){
                  Depuckerspeed = 0
                  Depuckerstate = 2
                  DepuckerspeedTemp = Depuckerct
                  DepuckerflagStopped = true
                  DepuckerflagRunning = false
                  DepuckerflagPrint = 1
                }
              }
              Depuckeractual = Depuckerct
              if(Date.now() - 60000 * DepuckerWorktime >= Depuckersec && DepuckersecStop == 0){
                if(DepuckerflagRunning && Depuckerct){
                  DepuckerflagPrint = 1
                  DepuckersecStop = 0
                  Depuckerspeed = Depuckerct - DepuckerspeedTemp
                  DepuckerspeedTemp = Depuckerct
                  Depuckersec = Date.now()
                }
              }
              Depuckerresults = {
                ST: Depuckerstate,
                CPQI : CntInDepucker,
                CPQO : CntOutDepucker,
                SP: Depuckerspeed
              }
              if (DepuckerflagPrint == 1) {
                for (var key in Depuckerresults) {
                  if( Depuckerresults[key] != null && ! isNaN(Depuckerresults[key]) )
                  //NOTE: Cambiar path
                  fs.appendFileSync('C:/PULSE/L8_LOGS/mex_pcl_Depucker_L8.log', 'tt=' + Depuckertime + ',var=' + key + ',val=' + Depuckerresults[key] + '\n')
                }
                DepuckerflagPrint = 0
                DepuckersecStop = 0
                Depuckertime = Date.now()
              }
        //------------------------------------------Depucker----------------------------------------------
        //------------------------------------------Capper----------------------------------------------
              Capperct = CntOutCapper // NOTE: igualar al contador de salida
              if (!CapperONS && Capperct) {
                CapperspeedTemp = Capperct
                Cappersec = Date.now()
                CapperONS = true
                Cappertime = Date.now()
              }
              if(Capperct > Capperactual){
                if(CapperflagStopped){
                  Capperspeed = Capperct - CapperspeedTemp
                  CapperspeedTemp = Capperct
                  Cappersec = Date.now()
                  CapperdeltaRejected = null
                  CapperRejectFlag = false
                  Cappertime = Date.now()
                }
                CappersecStop = 0
                Capperstate = 1
                CapperflagStopped = false
                CapperflagRunning = true
              } else if( Capperct == Capperactual ){
                if(CappersecStop == 0){
                  Cappertime = Date.now()
                  CappersecStop = Date.now()
                }
                if( ( Date.now() - ( CappertimeStop * 1000 ) ) >= CappersecStop ){
                  Capperspeed = 0
                  Capperstate = 2
                  CapperspeedTemp = Capperct
                  CapperflagStopped = true
                  CapperflagRunning = false
                  CapperflagPrint = 1
                }
              }
              Capperactual = Capperct
              if(Date.now() - 60000 * CapperWorktime >= Cappersec && CappersecStop == 0){
                if(CapperflagRunning && Capperct){
                  CapperflagPrint = 1
                  CappersecStop = 0
                  Capperspeed = Capperct - CapperspeedTemp
                  CapperspeedTemp = Capperct
                  Cappersec = Date.now()
                }
              }
              Capperresults = {
                ST: Capperstate,
                CPQI : CntInCapper,
                CPQO : CntOutCapper,
                //CPQR : CapperdeltaRejected,
                SP: Capperspeed
              }
              if (CapperflagPrint == 1) {
                for (var key in Capperresults) {
                  if( Capperresults[key] != null && ! isNaN(Capperresults[key]) )
                  //NOTE: Cambiar path
                  fs.appendFileSync('C:/PULSE/L8_LOGS/mex_pcl_Capper_L8.log', 'tt=' + Cappertime + ',var=' + key + ',val=' + Capperresults[key] + '\n')
                }
                CapperflagPrint = 0
                CappersecStop = 0
                Cappertime = Date.now()
              }
        //------------------------------------------Capper----------------------------------------------
        //------------------------------------------CapSupply----------------------------------------------
              CapSupplyct = CntOutCapSupply // NOTE: igualar al contador de salida
              if (!CapSupplyONS && CapSupplyct) {
                CapSupplyspeedTemp = CapSupplyct
                CapSupplysec = Date.now()
                CapSupplyONS = true
                CapSupplytime = Date.now()
              }
              if(CapSupplyct > CapSupplyactual){
                if(CapSupplyflagStopped){
                  CapSupplyspeed = CapSupplyct - CapSupplyspeedTemp
                  CapSupplyspeedTemp = CapSupplyct
                  CapSupplysec = Date.now()
                  CapSupplydeltaRejected = null
                  CapSupplyRejectFlag = false
                  CapSupplytime = Date.now()
                }
                CapSupplysecStop = 0
                CapSupplystate = 1
                CapSupplyflagStopped = false
                CapSupplyflagRunning = true
              } else if( CapSupplyct == CapSupplyactual ){
                if(CapSupplysecStop == 0){
                  CapSupplytime = Date.now()
                  CapSupplysecStop = Date.now()
                }
                if( ( Date.now() - ( CapSupplytimeStop * 1000 ) ) >= CapSupplysecStop ){
                  CapSupplyspeed = 0
                  CapSupplystate = 2
                  CapSupplyspeedTemp = CapSupplyct
                  CapSupplyflagStopped = true
                  CapSupplyflagRunning = false
                  CapSupplyflagPrint = 1
                }
              }
              CapSupplyactual = CapSupplyct
              if(Date.now() - 60000 * CapSupplyWorktime >= CapSupplysec && CapSupplysecStop == 0){
                if(CapSupplyflagRunning && CapSupplyct){
                  CapSupplyflagPrint = 1
                  CapSupplysecStop = 0
                  CapSupplyspeed = CapSupplyct - CapSupplyspeedTemp
                  CapSupplyspeedTemp = CapSupplyct
                  CapSupplysec = Date.now()
                }
              }
              CapSupplyresults = {
                ST: CapSupplystate,
                CPQO : CntOutCapSupply,
                SP: CapSupplyspeed
              }
              if (CapSupplyflagPrint == 1) {
                for (var key in CapSupplyresults) {
                  if( CapSupplyresults[key] != null && ! isNaN(CapSupplyresults[key]) )
                  //NOTE: Cambiar path
                  fs.appendFileSync('C:/PULSE/L8_LOGS/mex_pcl_CapSupply_L8.log', 'tt=' + CapSupplytime + ',var=' + key + ',val=' + CapSupplyresults[key] + '\n')
                }
                CapSupplyflagPrint = 0
                CapSupplytime = Date.now()
                CapSupplysecStop = 0
              }
        //------------------------------------------CapSupply----------------------------------------------
        /*----------------------------------------------------------------------------------EOL----------------------------------------------------------------------------------*/
            if(secEOLManualPacking>=60 && CntOutEOLManualPacking){
              fs.appendFileSync("C:/PULSE/L8_LOGS/mex_pcl_EOLManualPacking_L8.log","tt="+Date.now()+",var=EOL"+",val="+CntOutEOLManualPacking+"\n");
              secEOLManualPacking=0;
            }else{
              secEOLManualPacking++;
            }
      /*----------------------------------------------------------------------------------EOL----------------------------------------------------------------------------------*/

              });//Cierre de lectura

          },1000);
      });//Cierre de cliente
client2.on('error', function(err) {
  clearInterval(intId2);
});
client2.on('close', function() {
	clearInterval(intId2);
});

  client3.on('connect', function(err) {
            intId3 = setInterval(function(){
                client3.readHoldingRegisters(0, 16).then(function(resp) {
                  CntOutCaseFormer  = joinWord(resp.register[0], resp.register[1]);
                  CntOutCasePacker  = joinWord(resp.register[2], resp.register[3]);
                  CntInCasePacker   = joinWord(resp.register[4], resp.register[5]);
                  CntOutLabeler     = joinWord(resp.register[6], resp.register[7]);
                  CntOutEOL         = joinWord(resp.register[8], resp.register[9]);
                  CntInManualPacking = joinWord(resp.register[10], resp.register[11]);
        //------------------------------------------Labeler----------------------------------------------
              Labelerct = CntOutLabeler // NOTE: igualar al contador de salida
              if (!LabelerONS && Labelerct) {
                LabelerspeedTemp = Labelerct
                Labelersec = Date.now()
                LabelerONS = true
                Labelertime = Date.now()
              }
              if(Labelerct > Labeleractual){
                if(LabelerflagStopped){
                  Labelerspeed = Labelerct - LabelerspeedTemp
                  LabelerspeedTemp = Labelerct
                  Labelersec = Date.now()
                  LabelerdeltaRejected = null
                  LabelerRejectFlag = false
                  Labelertime = Date.now()
                }
                LabelersecStop = 0
                Labelerstate = 1
                LabelerflagStopped = false
                LabelerflagRunning = true
              } else if( Labelerct == Labeleractual ){
                if(LabelersecStop == 0){
                  Labelertime = Date.now()
                  LabelersecStop = Date.now()
                }
                if( ( Date.now() - ( LabelertimeStop * 1000 ) ) >= LabelersecStop ){
                  Labelerspeed = 0
                  Labelerstate = 2
                  LabelerspeedTemp = Labelerct
                  LabelerflagStopped = true
                  LabelerflagRunning = false
                  LabelerflagPrint = 1
                }
              }
              Labeleractual = Labelerct
              if(Date.now() - 60000 * LabelerWorktime >= Labelersec && LabelersecStop == 0){
                if(LabelerflagRunning && Labelerct){
                  LabelerflagPrint = 1
                  LabelersecStop = 0
                  Labelerspeed = Labelerct - LabelerspeedTemp
                  LabelerspeedTemp = Labelerct
                  Labelersec = Date.now()
                }
              }
              Labelerresults = {
                ST: Labelerstate,
                CPQI : CntInLabeler,
                CPQO : CntOutLabeler,
                //CPQR : LabelerdeltaRejected,
                SP: Labelerspeed
              }
              if (LabelerflagPrint == 1) {
                for (var key in Labelerresults) {
                  if( Labelerresults[key] != null && ! isNaN(Labelerresults[key]) )
                  //NOTE: Cambiar path
                  fs.appendFileSync('C:/PULSE/L8_LOGS/mex_pcl_Labeler_L8.log', 'tt=' + Labelertime + ',var=' + key + ',val=' + Labelerresults[key] + '\n')
                }
                LabelerflagPrint = 0
                LabelersecStop = 0
                Labelertime = Date.now()
              }
        //------------------------------------------Labeler----------------------------------------------
        //------------------------------------------ManualPacking----------------------------------------------
              ManualPackingct = CntInManualPacking // NOTE: igualar al contador de salida
              if (!ManualPackingONS && ManualPackingct) {
                ManualPackingspeedTemp = ManualPackingct
                ManualPackingsec = Date.now()
                ManualPackingONS = true
                ManualPackingtime = Date.now()
              }
              if(ManualPackingct > ManualPackingactual){
                if(ManualPackingflagStopped){
                  ManualPackingspeed = ManualPackingct - ManualPackingspeedTemp
                  ManualPackingspeedTemp = ManualPackingct
                  ManualPackingsec = Date.now()
                  ManualPackingdeltaRejected = null
                  ManualPackingRejectFlag = false
                  ManualPackingtime = Date.now()
                }
                ManualPackingsecStop = 0
                ManualPackingstate = 1
                ManualPackingflagStopped = false
                ManualPackingflagRunning = true
              } else if( ManualPackingct == ManualPackingactual ){
                if(ManualPackingsecStop == 0){
                  ManualPackingtime = Date.now()
                  ManualPackingsecStop = Date.now()
                }
                if( ( Date.now() - ( ManualPackingtimeStop * 1000 ) ) >= ManualPackingsecStop ){
                  ManualPackingspeed = 0
                  ManualPackingstate = 2
                  ManualPackingspeedTemp = ManualPackingct
                  ManualPackingflagStopped = true
                  ManualPackingflagRunning = false
                  ManualPackingflagPrint = 1
                }
              }
              ManualPackingactual = ManualPackingct
              if(Date.now() - 60000 * ManualPackingWorktime >= ManualPackingsec && ManualPackingsecStop == 0){
                if(ManualPackingflagRunning && ManualPackingct){
                  ManualPackingflagPrint = 1
                  ManualPackingsecStop = 0
                  ManualPackingspeed = ManualPackingct - ManualPackingspeedTemp
                  ManualPackingspeedTemp = ManualPackingct
                  ManualPackingsec = Date.now()
                }
              }
              ManualPackingresults = {
                ST: ManualPackingstate,
                CPQI : CntInManualPacking,
                SP: ManualPackingspeed
              }
              if (ManualPackingflagPrint == 1) {
                for (var key in ManualPackingresults) {
                  if( ManualPackingresults[key] != null && ! isNaN(ManualPackingresults[key]) )
                  //NOTE: Cambiar path
                  fs.appendFileSync('C:/PULSE/L8_LOGS/mex_pcl_ManualPacking_L8.log', 'tt=' + ManualPackingtime + ',var=' + key + ',val=' + ManualPackingresults[key] + '\n')
                }
                ManualPackingflagPrint = 0
                ManualPackingsecStop = 0
                ManualPackingtime = Date.now()
              }
        //------------------------------------------ManualPacking----------------------------------------------
        //------------------------------------------CaseFormer----------------------------------------------
              CaseFormerct = CntOutCaseFormer // NOTE: igualar al contador de salida
              if (!CaseFormerONS && CaseFormerct) {
                CaseFormerspeedTemp = CaseFormerct
                CaseFormersec = Date.now()
                CaseFormerONS = true
                CaseFormertime = Date.now()
              }
              if(CaseFormerct > CaseFormeractual){
                if(CaseFormerflagStopped){
                  CaseFormerspeed = CaseFormerct - CaseFormerspeedTemp
                  CaseFormerspeedTemp = CaseFormerct
                  CaseFormersec = Date.now()
                  CaseFormerdeltaRejected = null
                  CaseFormerRejectFlag = false
                  CaseFormertime = Date.now()
                }
                CaseFormersecStop = 0
                CaseFormerstate = 1
                CaseFormerflagStopped = false
                CaseFormerflagRunning = true
              } else if( CaseFormerct == CaseFormeractual ){
                if(CaseFormersecStop == 0){
                  CaseFormertime = Date.now()
                  CaseFormersecStop = Date.now()
                }
                if( ( Date.now() - ( CaseFormertimeStop * 1000 ) ) >= CaseFormersecStop ){
                  CaseFormerspeed = 0
                  CaseFormerstate = 2
                  CaseFormerspeedTemp = CaseFormerct
                  CaseFormerflagStopped = true
                  CaseFormerflagRunning = false
                  CaseFormerflagPrint = 1
                }
              }
              CaseFormeractual = CaseFormerct
              if(Date.now() - 60000 * CaseFormerWorktime >= CaseFormersec && CaseFormersecStop == 0){
                if(CaseFormerflagRunning && CaseFormerct){
                  CaseFormerflagPrint = 1
                  CaseFormersecStop = 0
                  CaseFormerspeed = CaseFormerct - CaseFormerspeedTemp
                  CaseFormerspeedTemp = CaseFormerct
                  CaseFormersec = Date.now()
                }
              }
              CaseFormerresults = {
                ST: CaseFormerstate,
                CPQO : CntOutCaseFormer,
                SP: CaseFormerspeed
              }
              if (CaseFormerflagPrint == 1) {
                for (var key in CaseFormerresults) {
                  if( CaseFormerresults[key] != null && ! isNaN(CaseFormerresults[key]) )
                  //NOTE: Cambiar path
                  fs.appendFileSync('C:/PULSE/L8_LOGS/mex_pcl_CaseFormer_L8.log', 'tt=' + CaseFormertime + ',var=' + key + ',val=' + CaseFormerresults[key] + '\n')
                }
                CaseFormerflagPrint = 0
                CaseFormersecStop = 0
                CaseFormertime = Date.now()
              }
        //------------------------------------------CaseFormer----------------------------------------------
        //------------------------------------------CasePacker----------------------------------------------
                CasePackerct = CntOutCasePacker // NOTE: igualar al contador de salida
                if (!CasePackerONS && CasePackerct) {
                  CasePackerspeedTemp = CasePackerct
                  CasePackersec = Date.now()
                  CasePackerONS = true
                  CasePackertime = Date.now()
                }
                if(CasePackerct > CasePackeractual){
                  if(CasePackerflagStopped){
                    CasePackerspeed = CasePackerct - CasePackerspeedTemp
                    CasePackerspeedTemp = CasePackerct
                    CasePackersec = Date.now()
                    CasePackerdeltaRejected = null
                    CasePackerRejectFlag = false
                    CasePackertime = Date.now()
                  }
                  CasePackersecStop = 0
                  CasePackerstate = 1
                  CasePackerflagStopped = false
                  CasePackerflagRunning = true
                } else if( CasePackerct == CasePackeractual ){
                  if(CasePackersecStop == 0){
                    CasePackertime = Date.now()
                    CasePackersecStop = Date.now()
                  }
                  if( ( Date.now() - ( CasePackertimeStop * 1000 ) ) >= CasePackersecStop ){
                    CasePackerspeed = 0
                    CasePackerstate = 2
                    CasePackerspeedTemp = CasePackerct
                    CasePackerflagStopped = true
                    CasePackerflagRunning = false
                    CasePackerflagPrint = 1
                  }
                }
                CasePackeractual = CasePackerct
                if(Date.now() - 60000 * CasePackerWorktime >= CasePackersec && CasePackersecStop == 0){
                  if(CasePackerflagRunning && CasePackerct){
                    CasePackerflagPrint = 1
                    CasePackersecStop = 0
                    CasePackerspeed = CasePackerct - CasePackerspeedTemp
                    CasePackerspeedTemp = CasePackerct
                    CasePackersec = Date.now()
                  }
                }
                CasePackerresults = {
                  ST: CasePackerstate,
                  CPQI : CntInCasePacker,
                  CPQO : CntOutCasePacker,
                  SP: CasePackerspeed
                }
                if (CasePackerflagPrint == 1) {
                  for (var key in CasePackerresults) {
                    if( CasePackerresults[key] != null && ! isNaN(CasePackerresults[key]) )
                    //NOTE: Cambiar path
                    fs.appendFileSync('C:/PULSE/L8_LOGS/mex_pcl_CasePacker_L8.log', 'tt=' + CasePackertime + ',var=' + key + ',val=' + CasePackerresults[key] + '\n')
                  }
                  CasePackerflagPrint = 0
                  CasePackersecStop = 0
                  CasePackertime = Date.now()
                }
          //------------------------------------------CasePacker----------------------------------------------
              /*----------------------------------------------------------------------------------EOL----------------------------------------------------------------------------------*/
                    if(secEOL>=60 && CntOutEOL){
                      fs.appendFileSync("C:/PULSE/L8_LOGS/mex_pcl_EOL_L8.log","tt="+Date.now()+",var=EOL"+",val="+CntOutEOL+"\n");
                      secEOL=0;
                    }else{
                      secEOL++;
                    }
              /*----------------------------------------------------------------------------------EOL----------------------------------------------------------------------------------*/

		});//Cierre de lectura

              },1000);
          });//Cierre de cliente
    client3.on('error', function(err) {
      clearInterval(intId3);
    });
    client3.on('close', function() {
    	clearInterval(intId3);
    });

    function getRejects() {
      var FillerDif = CntInFiller - CntOutFiller
      fs.appendFileSync('C:/PULSE/L8_LOGS/mex_pcl_Filler_L8.log', 'tt=' + Date.now() + ',var=CPQR,val=' + eval(FillerDif - FillerReject.rejected) + '\n')
      FillerReject.rejected = FillerDif
      fs.writeFileSync('FillerRejected.json', '{"rejected": ' + FillerReject.rejected + '}')
      var CapperDif = CntInCapper - CntOutCapper
      fs.appendFileSync('C:/PULSE/L8_LOGS/mex_pcl_Capper_L8.log', 'tt=' + Date.now() + ',var=CPQR,val=' + eval(CapperDif - CapperReject.rejected) + '\n')
      CapperReject.rejected = CapperDif
      fs.writeFileSync('CapperRejected.json', '{"rejected": ' + CapperReject.rejected + '}')
      var LabelerDif = CntOutCasePacker - CntOutLabeler
      fs.appendFileSync('C:/PULSE/L8_LOGS/mex_pcl_Labeler_L8.log', 'tt=' + Date.now() + ',var=CPQR,val=' + eval(LabelerDif - LabelerReject.rejected) + '\n')
      LabelerReject.rejected = LabelerDif
      fs.writeFileSync('LabelerRejected.json', '{"rejected": ' + LabelerReject.rejected + '}')
    }
    setTimeout(getRejects, 60000);
    var storeReject = setInterval(getRejects, 1740000);
//------------------------------Cerrar-código------------------------------
var shutdown = function () {
  client1.close()
  client2.close()
  client3.close()
  process.exit(0)
}

process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)
//------------------------------Cerrar-código------------------------------
}catch(err){
    fs.appendFileSync("error.log",err + '\n');
}
