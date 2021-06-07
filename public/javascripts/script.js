function addtoCart(proId){

    $.ajax({
            url:'/add-to-cart/'+proId,
            method:'get',
            success:(response)=>{
                if(response.status){
                    let count=$('#cartcount').html()
                    count=parseInt(count)+1
                    $('#cartcount').html(count)
                }
                   
            }
    })
  }