let complaints = document.getElementById('#complaints');

document.querySelector('#submitBtn').addEventListener('click', function(){
    document.querySelector('#fault-form').innerHTML = 'your form has been submitted';
    let name = document.querySelector('#name').value;
    let email = document.querySelector('#email').value;
    let details = document.querySelector('#details').value;
    document.querySelector('#fault-form').innerHTML =+ 
    `<ul>Complaint
    <li>name: ${name}</li>
    <li>email: ${email}</li>
    <li>complaint details: ${details}</li>
    </ul>`
})