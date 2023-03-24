var barcode = '';
var interval;
document.addEventListener('keydown', function(evt) {
    if (interval)
        clearInterval(interval);
    if (evt.code == 'Enter') {
        if (barcode)
            handleBarcode(barcode);
        barcode = '';
        return;
    }
    if (evt.key != 'Shift')
        barcode += evt.key;
    interval = setInterval(() => barcode = '', 800);
});

function handleBarcode(scanned_barcode) {
    
$.ajax({
    url: "./verifyScan",
    type: 'GET',
    contentType: "application/json",
    data: {
        code: scanned_barcode,
        
    },


    success: function(data) {

   if(data.length === 0){
     $("#barcodeNumber").val(scanned_barcode)
     $("#growerNumber").val('')
     $("#amount").val('')
     $("#name").val('')
     $("#surname").val('')
     $("#lotNumber").val('')
     $("#mass").val('')
     $("#center").val('') 
     $("#capturer").val('') 
    
        }else
        $("#barcodeNumber").val(data[0].barcodeNumber)
       $("#growerNumber").val(data[0].growerNumber)
     $("#amount").val(data[0].amount)
     $("#name").val(data[0].name)
     $("#surname").val(data[0].surname)
     $("#lotNumber").val(data[0].lotNumber)
     $("#mass").val(data[0].mass)
     $("#center").val(data[0].center) 
     $("#capturer").val(data[0].capturer) 
    }


   
})
  //  document.querySelector('#barcodeNumber').innerHTML = scanned_barcode;



}