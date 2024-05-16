
// page 404 (hiệu ứng)
function goBackHome() {
    window.location.href = '/';
  }
  
  tsParticles.load("tsparticles", {
    particles: {
      number: {
        value: 160,
        density: {
          enable: true,
          value_area: 800
        }
      },
      color: {
        value: "#ffffff"
      },
      shape: {
        type: "circle",
        stroke: {
          width: 0,
          color: "#000000"
        },
        polygon: {
          nb_sides: 5
        },
      },
      opacity: {
        value: 1,
        random: true,
        anim: {
          enable: true,
          speed: 1,
          opacity_min: 0,
          sync: false
        }
      },
      size: {
        value: 3,
        random: true,
        anim: {
          enable: false,
          speed: 4,
          size_min: 0.3,
          sync: false
        }
      },
      line_linked: {
        enable: false,
      },
      move: {
        enable: true,
        speed: 1,
        direction: "none",
        random: true,
        straight: false,
        out_mode: "out",
        bounce: false,
        attract: {
          enable: false,
          rotateX: 600,
          rotateY: 600
        }
      }
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: {
          enable: true,
          mode: "bubble"
        },
        onclick: {
          enable: true,
          mode: "repulse"
        },
        resize: true
      },
      modes: {
        grab: {
          distance: 400,
          line_linked: {
            opacity: 1
          }
        },
        bubble: {
          distance: 250,
          size: 0,
          duration: 2,
          opacity: 0,
          speed: 3
        },
        repulse: {
          distance: 400,
          duration: 0.4
        },
        push: {
          particles_nb: 4
        },
        remove: {
          particles_nb: 2
        }
      }
    },
    retina_detect: true
  });
  // end page 404 (hiệu ứng)

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