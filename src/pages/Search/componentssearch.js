import React, { useState } from 'react';
import ProductSearch from './ProductSearch';
import ProductDetailresult from './resultDetailsearch';

const App = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);

  // ฟังก์ชันสำหรับแสดงหน้ารายละเอียดสินค้า
  const handleShowDetail = (product) => {
    setSelectedProduct(product);
  };

  // ฟังก์ชันสำหรับกลับไปยังหน้าค้นหา
  const handleBackToSearch = () => {
    setSelectedProduct(null);
  };

 return (
        <div className="App">
          {selectedProduct ? (
            <ProductDetailresult     product={selectedProduct} onBack={handleBackToSearch} />
          ) : (
            <ProductSearch onShowDetail={handleShowDetail} />
          )}
        </div>
    );
};

export default App;