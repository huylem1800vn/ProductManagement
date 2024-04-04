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

// checkbox-multi 
const checkboxMulti = document.querySelector("[checkbox-multi]");
if(checkboxMulti) {
    const inputCheckall = checkboxMulti.querySelector("input[name='checkall']");
    // lấy ra các thẻ input có name là checkall
    const listInputId = checkboxMulti.querySelectorAll("input[name='id']");
    
    inputCheckall.addEventListener("click", () => {
        if(inputCheckall.checked) {
            listInputId.forEach(input => {
                input.checked = true;
            })      
        } else {
            listInputId.forEach(input => {
                input.checked = false;
            })
        } 
        
        
    })

    // khi tick đầy các ô ở dưới thì ô check all cũng được tick
    // xét các ôn input có thuộc tính name=id mỗi khi tick 1 ô thì đều xét trường hợp
    listInputId.forEach(inputId => {
        inputId.addEventListener("click", () => {
            const countInputIdChecked = checkboxMulti.querySelectorAll("input[name='id']:checked").length;
            const lengthtInputId = listInputId.length;
            //mỗi lần ô input có property name=id được tick đều chạy vào lệnh if else check một lần
            if(countInputIdChecked == lengthtInputId) {
                inputCheckall.checked = true;
            }
            else {
                inputCheckall.checked = false;
            }
        })
    })
}
// end checkbox-multi 

// form-change-multi 
const formChangeMulti = document.querySelector("[form-change-multi]");
if(formChangeMulti) {
    formChangeMulti.addEventListener("submit", (event) => {
        // do form mặc định khi click vào nút submit sẽ link thẳng sang trang, nên phải ngăn chặn hành vi mặc định là load lại trang, rồi điền các ids cho form 
        event.preventDefault();
        //logic dưới đây lấy ra giá trị các ô input đã check và gắn id vào ô input có name=ids
        const listInputIdChecked = document.querySelectorAll("input[name='id']:checked");
        if(listInputIdChecked.length > 0) {
            const ids = [];

            listInputIdChecked.forEach(input => {
                const id = input.value;
                ids.push(id);
            })

            const stringIds = ids.join(", "); // chuyển từ mảng thành chuỗi

            const input = formChangeMulti.querySelector("input[name='ids']");
            input.value = stringIds;

            // xử lý logic xong submit
            formChangeMulti.submit();

        } else {
            alert("Vui lòng chọn ít nhất 1 bản ghi!");
        }
    });
}
// end form-change-multi 

// button-delete
const listButtonDelete = document.querySelectorAll("[button-delete]");
if(listButtonDelete.length > 0) {
    const formDeleteItem = document.querySelector("[form-delete-item]");

    listButtonDelete.forEach(button => {
        button.addEventListener("click", () => {
            const isConfirm = confirm("Bạn có chắc muốn xóa?");

            if(isConfirm) {
                const id = button.getAttribute("data-id");
                const path = formDeleteItem.getAttribute("data-path");
        
                const action = `${path}/${id}?_method=DELETE`;
        
                formDeleteItem.action = action;
        
                formDeleteItem.submit();
            }
            
        });
    });
}
// end button-delete 