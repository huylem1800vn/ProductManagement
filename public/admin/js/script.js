// Button status

const listButtonStatus = document.querySelectorAll("[button-status]");
if (listButtonStatus.length > 0) {
    let url = new URL(window.location.href); // tạo ra một url mới

    listButtonStatus.forEach((button) => {
        button.addEventListener("click", () => {
            const status = button.getAttribute("button-status");
            if(status){
                url.searchParams.set("status", status); // Sau dấu ? trong URL trong frontend là searchParams còn backend là query
            } else {
                url.searchParams.delete("status");
            }
            window.location.href = url.href; // url là một object, gắn link trên window bằng link url
            
        })
    })
}


// End Button status