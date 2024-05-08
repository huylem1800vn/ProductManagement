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

// Update Cart
// tìm bảng table của giỏ hàng
const tableCart = document.querySelector("[table-cart]");
if(tableCart) {
    // lấy ra các ô input có  name = quantity
    const ListInputQuanlity = tableCart.querySelectorAll("input[name='quantity']");
    // lập qua từng ô input bắt sự kiện change, mỗi khi change giá trị thì lấy ra được giá trị mới của ô input đó
    ListInputQuanlity.forEach(input => {
        input.addEventListener("change", () => {
            // gắn value mới bằng giá trị của ô input
            const quantity = input.value;
            // lấy id của sản phẩm được tự định nghĩa sẵn trong ô input
            const productId = input.getAttribute("item-id");

            // cập nhật lại đường link mới, để tạo ra route có dạng như dưới và xử lý bên backend
            window.location.href = `/cart/update/${productId}/${quantity}`;
        });
    });
}
// End Update Cart