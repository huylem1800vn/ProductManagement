module.exports = (req, countRecords) => {
    const objectPagination = {
        currentPage: 1,
        limitItems: 4,
      }
    
      if(req.query.page) {
        objectPagination.currentPage = parseInt(req.query.page);
      }
    
      objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitItems;
    
      
      objectPagination.totalPage = Math.ceil(countRecords / objectPagination.limitItems);
      // Đếm các document(mỗi bảng ghi là 1 document)

      return objectPagination;
}