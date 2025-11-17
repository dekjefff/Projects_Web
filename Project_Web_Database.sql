create database if not exists `Eros`;

use `Eros`;

#drop database `Eros`;

create table if not exists customer(
	customer_ID int(10),
    first_anme varchar(255),
    last_name varchar(255),
    gender char(6),
    email varchar(255),
    phone int(10),
    membership_status varchar(50),
    constraint pk_customer primary key (customer_ID)
);

create table if not exists shipping_address(
	customer_ID int(10),
	shipping_address varchar(255),
    constraint pk_costomer primary key (customer_ID),
    constraint fk_customer foreign key (customer_ID) references customer(customer_ID)
);

create table if not exists brand(
	brand_ID int(10),
    brand_anme varchar(100),
    brand_description varchar(255),
    brand_logo_url varchar(255),
    constraint pk_brand primary key (brand_ID)
);

create table if not exists supplier(
	supplier_ID int(10),
    supplier_name varchar(255),
    contract_info varchar(255),
    location varchar(255),
    rating decimal(5,0),
    constraint primary key (supplier_ID)
);

create table if not exists product(
	product_ID int(10),
    product_name varchar(255),
    _description varchar(255),
    price decimal(8, 2),
    image_url varchar(255),
    stock_quantity int(5),
    size int(3),
    customer_ID int(10),
    brand_ID int(10),
    supplier_ID int(10),
    constraint pk_product primary key (product_ID),
    constraint fk_p_customer foreign key (customer_ID) references customer(customer_ID),
    constraint fk_p_brand foreign key (brand_ID) references brand(brand_ID),
    constraint fk_p_supplier foreign key (supplier_ID) references supplier(supplier_ID)
);

create table if not exists shipping(
	shipping_ID int(10),
    shipping_date datetime,
    tracking_namber varchar(50),
    shipping_status char(10),
    constraint pk_shipping primary key (shipping_ID)
);

create table if not exists payment(
	payment_ID int(10),
    payment_date datetime,
    payment_amount decimal(9,2),
    paymeny_medthod varchar(100),
    payment_status char(10),
    constraint pk_payment primary key (payment_ID)
);

create table if not exists orders(
	order_ID int(10),
    order_date datetime,
    order_status char(10),
    total_amount decimal(9,2),
    shipping_ID int(10),
    payment_ID int(10),
    customer_ID int(10),
    constraint pk_orders primary key (order_ID),
    constraint fk_order foreign key (customer_ID) references customer(customer_ID),
    constraint fk_order_2 foreign key (shipping_ID) references shipping(shipping_ID),
    constraint fk_order_3 foreign key (payment_ID) references payment(payment_ID)
);


create table if not exists category(
	category_ID int(10),
    category_name varchar(100),
    category_description varchar(200),
    constraint pk_category primary key (category_ID)
);
	

create table if not exists whishlist(
	whishlist_ID int(10),
    customer_ID int(10),
    product_ID int(10),
    create_at datetime,
    constraint pk_whishlist primary key (whishlist_ID),
    constraint fk_w_customer foreign key (customer_ID) references customer(customer_ID),
    constraint fk_w_product foreign key (product_ID) references product(product_ID)
);

create table if not exists review(
	review_ID int(10),
    customer_ID int(10),
    product_ID int(10),
    rating int(5),
    review_text varbinary(255),
    review_date datetime,
    constraint pk_review primary key (review_ID),
    constraint fk_r_customer foreign key (customer_ID) references customer(customer_ID),
    constraint fk_r_product foreign key (product_ID) references product(product_ID)
); 

create table if not exists promotion(
	promotion_ID int(10),
    promotion_code varchar(255),
    descript varchar(255),
    discount_percentage decimal(3,0),
    start_date datetime,
    end_date datetime,
    constraint pk_promotion primary key (promotion_ID)
);

create table if not exists Transaction_History(
	transaction_ID int(10),
    order_ID int(10),
    customer_Id int(10),
    payment_ID int(10),
    transaction_date datetime,
    constraint pk_transaction primary key (transaction_ID),  
    constraint fk_t_customer foreign key (customer_ID) references customer(customer_ID),
    constraint fk_t_payment foreign key (payment_ID) references payment(payment_ID),
    constraint fk_t_order foreign key (order_ID) references orders(order_ID)
);

create table if not exists cart(
	 cart_ID int(10),
     customer_ID int(10),
     product_ID int(10),
     quantity int(2),
     date_added datetime,
     constraint pk_cart primary key (cart_ID),
     constraint fk_c_customer foreign key (customer_ID) references customer(customer_ID),
     constraint fk_c_product foreign key (product_ID) references product(product_ID)
);


create table if not exists return_request(
	return_ID int(10),
    order_ID int(10),
    customer_ID int(10),
    reason_for_return varchar(255),
    return_date datetime,
    return_status varchar(10),
    constraint pk_return primary key (return_ID),
    constraint fk_re_order foreign key (order_ID) references orders(order_ID),
    constraint fk_re_customer foreign key (customer_ID) references customer(customer_ID)
);

create table if not exists _admin(
	admin_ID int(10),
    first_name varchar(255),
    last_name varchar(255),
    passwd varchar(255),
    email varchar(255),
    constraint pk_admin primary key (admin_ID)
);

create table if not exists UserAccount(
	user_ID int(10),
    passwd varchar(255),
    customer_ID int(10),
    constraint pk_user primary key (user_ID),
    constraint fk_user_customer foreign key (customer_ID) references customer(customer_ID)
);

create table if not exists order_product(
	order_ID int(10),
    product_ID int(10),
    constraint pk_o_p primary key (order_ID,product_ID),
    constraint fk_o_p_order foreign key (order_ID) references orders(order_ID), 
    constraint fk_o_p_product foreign key (product_ID) references product(product_ID)
); 

create table if not exists customer_promotion(
	customer_ID int(10),
    promotion_ID int(10),
    constraint pk_c_p primary key (customer_ID,promotion_ID),
    constraint fk_c_p_customer foreign key (customer_ID) references customer(customer_ID),
    constraint fk_c_p_promotion foreign key (promotion_ID) references promotion(promotion_ID)
);

create table if not exists product_category(
	product_ID int(10),
    category_ID int(10),
    constraint pk_p_c primary key (product_ID,category_ID),
    constraint fk_p_c_product foreign key (product_ID) references product(product_ID),
    constraint fk_p_c_category foreign key (category_ID) references category(category_ID)
);

create table if not exists product_whishlist(
	product_ID int(10),
    whishlist_ID int(10),
    constraint pk_p_w primary key (product_ID,whishlist_ID),
    constraint fk_p_w_product foreign key (product_ID) references product(product_ID),
    constraint fk_p_w_whishlist foreign key (whishlist_ID) references whishlist(whishlist_ID)
);




