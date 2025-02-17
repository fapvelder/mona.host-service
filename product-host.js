export const productDomain = (userData, domain) => {
  return {
    fullname: userData.fullname,
    contact_name: userData.fullname,
    organization: userData.clients[0].organization,
    email: userData.email,
    country: userData.clients[0].country,
    province: userData.clients[0].province,
    address: userData.clients[0].address,
    ward: userData.clients[0].ward,
    district: userData.clients[0].district,
    fax: userData.phone_number,
    phone: userData.phone_number,
    gender: userData.gender,
    id_number: userData.id_number,
    tax_code: userData.clients[0].tax_code,
    birthday: userData.birthday,
    product_type: "domain",
    domain: domain.domain,
    amount: domain.buy_price,
    billing_cycle: domain.year * 12,
    order_item_type: "new",
  };
};
export const productSSLAndCPanel = (originalProduct, product, userDomain) => {
  return {
    product_id: product._id,
    product_type: product.product_type,
    domain: userDomain,
    amount: originalProduct.basePrice,
    billing_cycle: originalProduct.period,
    notes: null,
    order_item_type: "new",
  };
};
export const orderHost = (
  clientID,
  totalPrice,
  VAT,
  allData,
  orderItems,
  discountAmount,
  promoCode
) => {
  return {
    client_id: clientID,
    amount: 0,
    discount_amount: discountAmount,
    override_amount: totalPrice,
    tax_rate: 0.1,
    vat_amount: VAT,
    total_amount: totalPrice,
    payment_method: "transfer",
    notes: `mona-media: ${allData}`,
    order_items: orderItems ? orderItems : [],
  };
};
