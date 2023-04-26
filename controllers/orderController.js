const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const asyncHandler = require("express-async-handler");

const getCustomerOrders = asyncHandler(async (req, res) => {
	const items = await Order.find({ customer: req.params.id });
	res.json(items);
});

const getAdminOrders = asyncHandler(async (req, res) => {
	const items = await Order.find();
	res.json(items);
});

const createOrder = asyncHandler(async (req, res) => {
	var status = "pending";
	var products = "";
	var i = 0;
	const { customer, total } = req.body;
	var orderID = Math.floor(Math.random() * 100000);

	if (!customer || !total) {
		res.status(400);
		throw new Error("Failed creating order");
	} else {
		const items = await Cart.find({
			customer: customer,
		});

		while (i < items.length) {
			products = products + items[i].productName + " : " + items[i].quantity;
			if (i != items.length - 1) {
				products = products + " , ";
			}
			i++;
		}

		const order = new Order({
			customer,
			products,
			orderID,
			total,
			status,
		});

		const createdOrder = await order.save();

		res.status(201).json(createdOrder);
	}
});

const updateOrderStatus = asyncHandler(async (req, res) => {
	const { status } = req.body;

	const order = await Order.findById(req.params.id);

	if (order) {
		order.status = status;

		const updatedOrder = await order.save();
		res.json(updatedOrder);
	} else {
		res.status(404);
		throw new Error("Order not found");
	}
});

module.exports = {
	createOrder,
	getCustomerOrders,
	getAdminOrders,
	updateOrderStatus,
};
