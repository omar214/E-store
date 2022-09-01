interface IOrder {
	id?: number;
	userId?: number;
	status?: string;
}

interface ord_product {
	orderId?: number;
	product_id?: number;
	quantity?: number;
}

interface userOrder {
	orderid: number;
	status: string;
	quantity: number[];
	productname: string[];
}

export default IOrder;
export { ord_product, userOrder };
