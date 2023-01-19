module.exports = function (db) {

	async function createShop(shopName) {
		const result = await db.one(`insert into shop (name) values ($1) returning id`, [shopName], (data) => data.id);
		return result;
	}

	async function listShops() {
		const result = await db.manyOrNone(`select * from shop`);
		return result;
	}

	async function dealsForShop(shopId) {
		const result = await db.oneOrNone(`select * from mango_deal where shop_id = $1`, [shopId]);
		return result;
	}

	async function topFiveDeals() {
		const bestPriceSQL = `select name as shop_name, price, qty, round((price/qty), 2) as unit_price from mango_deal 
		join shop on shop.id = mango_deal.shop_id 
		order by (price/qty) asc 
		limit 5`

		const result = await db.any(bestPriceSQL);
		return result;

	}

	async function createDeal(shopId, qty, price) {
		await db.none(`insert into mango_deal (shop_id, qty, price) values ($1, $2, $3)`,
			[shopId, qty, price]);
	}

	async function recommendDeals(amount) {
		const result = await db.many(`
			select name, price, qty, round((price/qty), 2) as unit_price from mango_deal 
			join shop on shop.id = mango_deal.shop_id 
			where price <= $1 order by unit_price asc`, [amount]);

		return result;
	}

	return {
		createDeal,
		createShop,
		listShops,
		dealsForShop,
		recommendDeals,
		topFiveDeals
	}


}