// show-alert (hiển thị thông báo)
const showAlert = document.querySelector("[show-alert]");
if(showAlert) { 
    const time = parseInt(showAlert.getAttribute("data-time"));
    
    // Sau time giây sẽ đóng thông báo
    setTimeout( () => {
        showAlert.classList.add("alert-hidden");
    }, time);

    // Khi click vào nút sẽ đóng luôn
    const closeAlert = showAlert.querySelector("[close-alert]");
    closeAlert.addEventListener("click", () => {
        showAlert.classList.add("alert-hidden");
    }) 
}
// end show-alert