const {log}=console;
const button:HTMLElement | null=document.getElementById("loginButton");
button.addEventListener("click",(event:Event)=>{
    event.preventDefault();
    const answers:any={}
    const loginInput=document.querySelectorAll(".loginInput");
    loginInput.forEach((item:any)=>{
        answers[item.name]=item.value
    });
    fetch("http://127.0.0.1:8000/sign-in",{
        method:"POST",
        redirect:"follow",
        headers:{
            "Content-Type": "application/json",
        },
        body:JSON.stringify(answers),
        credentials:"include"
    }).then(res=>res.redirected?window.location.href=res.url:null);
});
