module.exports = (req) => {
    const filterStatus = [
        {
          name: "Tất cả",
          status: "",
          class: "",
        },
        {
          name: "Hoạt động",
          status: "active",
          class: "",
        },
        {
          name: "Dừng hoạt động",
          status: "inactive",
          class: "",
        }
      ];// mảng chứa các phần tử button trong trang products
    
      
      if(req.query.status) {
        const index = filterStatus.findIndex(item => item.status == req.query.status);// tìm trong mảng filterStatus có bản ghi status bằng với bản ghi nào có status bằng item.status và trả về index của bản ghi đó
        filterStatus[index].class = "active";
      } else {
        const index = filterStatus.findIndex(item => item.status == "");
        filterStatus[index].class = "active";
      }

      return filterStatus;
}