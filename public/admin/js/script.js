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

// form-change-multi (thay đổi nhiều trạng thái)
const formChangeMulti = document.querySelector("[form-change-multi]");
if(formChangeMulti) {
    formChangeMulti.addEventListener("submit", (event) => {
        // do form mặc định khi click vào nút submit sẽ link thẳng sang trang, nên phải ngăn chặn hành vi mặc định là load lại trang, rồi điền các ids cho form 
        event.preventDefault();
        //logic dưới đây lấy ra giá trị các ô input đã check và gắn id vào ô input có name=ids
        const type = formChangeMulti.querySelector("select[name='type']").value;
        const listInputIdChecked = document.querySelectorAll("input[name='id']:checked");
        if(listInputIdChecked.length > 0) {
            const ids = [];

            listInputIdChecked.forEach(input => {
                const id = input.value;

                if(type == "change-position") {
                    const position = input.closest("tr").querySelector("input[name='position']").value;// đi ra thẻ cha tr của thẻ hiện tại
                    console.log(position);


                    ids.push(`${id}-${position}`);
                }
                else {
                    ids.push(id);
                }
            })

            const stringIds = ids.join(", "); // chuyển từ mảng thành chuỗi

            const input = formChangeMulti.querySelector("input[name='ids']");
            input.value = stringIds;

            if(type == "delete-all"){
                const isConfirm = confirm("Bạn có chắc muốn xoá những bản ghi này!");
                if(!isConfirm){
                    return;
                }
            }

            console.log(ids);
            console.log(type);

            formChangeMulti.submit();// xử lý logic xong submit
            

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

// button-delete-forever
const listButtonDeleteForever = document.querySelectorAll("[button-delete-forever]");
if(listButtonDeleteForever.length > 0) {
    const formDeleteItemForever = document.querySelector("[form-delete-item-forever]");

    listButtonDeleteForever.forEach(button => {
        button.addEventListener("click", () => {
            const isConfirm = confirm("Bạn có chắc muốn xóa vĩnh viễn?");

            if(isConfirm) {
                const id = button.getAttribute("data-id");

                const path = formDeleteItemForever.getAttribute("data-path");
        
                const action = `${path}/${id}?_method=DELETE`;
        
                formDeleteItemForever.action = action;
        
                formDeleteItemForever.submit();
            }
            
        });
    });
}
// end button-delete-forever 

// button-restore
const listButtonRestore = document.querySelectorAll("[button-restore]");
if(listButtonRestore.length > 0) {
    const formRestore = document.querySelector("[form-restore]");

    listButtonRestore.forEach(button => {
        button.addEventListener("click", () => {
            const isConfirm = confirm("Bạn có mốn khôi phục sản phẩm?");

            if(isConfirm) {
                const id = button.getAttribute("data-id");

                const path = formRestore.getAttribute("data-path");
        
                const action = `${path}/${id}`;
        
                formRestore.action = action;
        
                formRestore.submit();
            }
            
        });
    });
}
// end button-delete-forever 

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

// upload-image (xem trước (preview) ảnh)
const uploadImage = document.querySelector("[upload-image]");
if(uploadImage) {
    const uploadImageInput = uploadImage.querySelector("[upload-image-input]");
    const uploadImagePreview = uploadImage.querySelector("[upload-image-preview]");

    uploadImageInput.addEventListener("change", () => {
        const file = uploadImageInput.files[0];
        if(file) {
            uploadImagePreview.src = URL.createObjectURL(file);
        }
    })
}
// End upload-image 

// Sort
// thẻ div cha có thuộc tính sort
const sort = document.querySelector("[sort]");
if(sort) {
    let url = new URL(window.location.href);
    const sortSelect = sort.querySelector("[sort-select]");
    // Lắng nghe thay đổi sắp xếp
    sortSelect.addEventListener("change", () => {
        const [sortKey, sortValue] = sortSelect.value.split("-");
        
        url.searchParams.set("sortKey", sortKey); 
        url.searchParams.set("sortValue", sortValue); 

        window.location.href = url.href; 
    });

    // Thêm selected cho lựa chọn hiện tại
    const selectedSortKey = url.searchParams.get("sortKey"); 
    const selectedSortValue = url.searchParams.get("sortValue"); 
    if(selectedSortKey && selectedSortValue) {
        const stringSort = `${selectedSortKey}-${selectedSortValue}`;
        const optionSelected = sortSelect.querySelector(`option[value='${stringSort}']`);
        optionSelected.selected = true;// làm cho thanh select tự động set selected như trên url gửi
    }
}
// End Sort

// Sort Clear Button
if(sort){
    const sortSelect = sort.querySelector("[sort-select]");
    const sortClearButton = sort.querySelector("[sort-clear]");
    
    let url = new URL(window.location.href);
    sortClearButton.addEventListener("click", () => {
        const [sortKey, sortValue] = sortSelect.value.split("-");
        // console.log(sortKey);  
        // console.log(sortValue); 
        if(sortKey && sortValue) {
            url.searchParams.delete("sortKey"); 
            url.searchParams.delete("sortValue");
        }

        window.location.href = url.href; 
    });
}
// End Sort Clear Button


// Table Permissions (Phân quyền)
const buttonSubmitPermissions = document.querySelector("[button-submit-permissions]");
if(buttonSubmitPermissions) {
    buttonSubmitPermissions.addEventListener("click", () => {
        const roles = [];
        const tablePermissions = document.querySelector("[table-permissions]");
        const rows = tablePermissions.querySelectorAll("tbody tr[data-name]");
        
        rows.forEach((row, index) => {
            // lấy giá trị thuộc tính data-name
            const dataName = row.getAttribute("data-name");
            // lấy giá trị ô input của hàng đó
            const inputs = row.querySelectorAll("input");

            // sau đó nếu có thẻ tr là id, thì sẽ lấy ra giá trị input của hàng đó, vì nó chứa id của các quyền
            if(dataName == "id") {  
                inputs.forEach((input) => {
                    const id = input.value;
                    // push các id vào mảng chứa object, object dưới là các object chứa id
                    roles.push({
                        id: id,
                        permissions: [],
                    });
                })
            } else {
                inputs.forEach((input, index) => {
                    // kiểm tra xin ô input nào được check
                    const inputChecked = input.checked;
                    if(inputChecked) {
                        roles[index].permissions.push(dataName);
                    }
                    // console.log(dataName);
                    // console.log(inputChecked)
                    // console.log(index)
                    // console.log("----------------------------")
                });
            }
        });

        if(roles.length > 0) {
            // gán cho ô input có name="roles", một value bằng mảng roles
            const formChangePermissions =  document.querySelector("[form-change-permissions]");
            const inputRoles = formChangePermissions.querySelector("input[name='roles']");
            // các ô input giá trị lưu là một chuỗi chứ không phải 1 mảng
            // trước khi lưu vào input thì nên chuyển nó thành chuỗi (vì roles là một mảng), nên chuyển mảng thành chuỗi json
            inputRoles.value = JSON.stringify(roles);
            formChangePermissions.submit();
        }
    });
}
// End Table Permissions (Phân quyền)

//Data default Table Permissions (hiển thị tick mặc định khi set trên data)
// mục đích tạo thẻ div tạo ra thuộc tính data-records=records, là để lấy ra data từ backend gửi lên giao diện rồi mới truyền qua cho frontend
const dataRecords = document.querySelector("[data-records]");
if(dataRecords) {
    // lấy ra giá trị của thuộc tính data-records
    // hiển thị data vào trong html, thì mặc định html sẽ convert thành chuỗi json, nên phải convert về thành mảng trong js
    const records = JSON.parse(dataRecords.getAttribute("data-records"));
    const tablePermissions = document.querySelector("[table-permissions]");

    records.forEach((record, index) => {
        const permissions = record.permissions;
        // console.log(permissions);
        // console.log(index);
        permissions.forEach(permission => {
            // truy vấn ra một hàng thẻ tr trong thẻ table có thuộc tính data-name giống như chuỗi đã gửi lên từ backend móc từ database
            const row = tablePermissions.querySelector(`tr[data-name="${permission}"]`);
            // lấy ra các thẻ input trong hàng đó và dựa theo index để xác định, truy vấn vào ô input ở vị trí thứ index
            // const inputs = row.querySelectorAll("input");
            // inputs[index].checked = true; 2 hàng này là cách trình bày 1
            const input = row.querySelectorAll("input")[index];
            input.checked = true;
        })
    })
}
//End Data default Table Permissions

