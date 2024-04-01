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

// Form Search 
const formsearch = document.querySelector("#form-search");
if(formsearch) {
    let url = new URL(window.location.href);

    formsearch.addEventListener("submit", (event) => {
        event.preventDefault(); // Ngăn chặn hành vi mặc định, load lại page và link thẳng đường dẫn keyword=...
        
        const keyword = event.target.elements.keyword.value;
        
        if(keyword){
            url.searchParams.set("keyword", keyword); 
        } else {
            url.searchParams.delete("keyword");
        }
        window.location.href = url.href; 
    })
}
// End Form Search 

// Button Pagination 
const listButtonPagination = document.querySelectorAll("[button-pagination]");
if(listButtonPagination.length > 0){
    let url = new URL(window.location.href);

    listButtonPagination.forEach((button) => {
        button.addEventListener("click", () => {
            const page = button.getAttribute("button-pagination");
            url.searchParams.set("page", page);
            window.location.href = url.href;
        })
    }) 
}
// End Button Pagination 

// button-change-status 
const listButtonChangeStauts = document.querySelectorAll("[button-change-status]");
if(listButtonChangeStauts.length > 0){
    const formChangeStatus = document.querySelector("[form-change-status]");

    listButtonChangeStauts.forEach(button => {
        button.addEventListener("click", () => {
            const id = button.getAttribute("data-id");
            const status = button.getAttribute("data-status");
            const path = formChangeStatus.getAttribute("data-path");

            const action = `${path}/${status}/${id}?_method=PATCH`;

            formChangeStatus.action = action;

            formChangeStatus.submit();
        });
    });
}
// end button-change-status 