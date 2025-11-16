const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <img src={product.imageUrl} alt={product.name} />
      <p className="product-brand">{product.brand}</p>
      <p className="product-name">**{product.name}**</p>
      <p className="product-price">{product.price}</p>
      <button className="add-btn">ADD</button>
    </div>
  );
};

export default ProductCard;