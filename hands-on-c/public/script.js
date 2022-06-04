let submitBtn = document.querySelector('#submitBtn');
submitBtn.addEventListener('click', function(){
    if(document.querySelector('#name').value.length <3 || document.querySelector('#name').value.length >200 ){
    alert('name invalid, too short/long')
    }
})