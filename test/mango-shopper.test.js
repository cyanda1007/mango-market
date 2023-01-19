let assert = require("assert");
const pgp = require('pg-promise')();
let MangoShopper = require("../mango-shopper");
require('dotenv').config()

// TODO configure this to work.
const connectionString = process.env.DATABASE_URL || "postgrsql://postgres:Cyanda@100%@localhost:5432/mango_market";

const db = pgp(connectionString);

describe('The mango shopper', function () {

    beforeEach(async function () {
        await db.none(`delete from mango_deal;`)
        await db.none(`delete from shop;`)
    });

    it('should be able to create a shop', async function () {

        const mangoShopper = MangoShopper(db);

        await mangoShopper.createShop('Mango Market');
        const shops = await await mangoShopper.listShops();

        assert.equal('Mango Market', shops[0].name);
    });

    it('should be able to return a list of all shops', async function () {

        const mangoShopper = MangoShopper(db);

        const beforeShops = await mangoShopper.listShops();
        assert.deepStrictEqual(0, beforeShops.length);

        await mangoShopper.createShop('Mango Market');
        await mangoShopper.createShop('Mangos to Go');
        await mangoShopper.createShop('Corner Veggies');

        const shops = await mangoShopper.listShops();
        assert.deepStrictEqual(3, shops.length);

    });

    it('should be able to create an mango deal and find it again', async function () {

        const mangoShopper = MangoShopper(db);

        const shopId = await mangoShopper.createShop('Mango Market');
        await mangoShopper.createDeal(shopId, 5, 28);


    })

    it('should return all the deals for a given shop', async function () {

        const mangoShopper = MangoShopper(db);



    });

    it('should return the top 5 deals', async function () {

        const mangoShopper = MangoShopper(db);

        const shopId1 = await mangoShopper.createShop('Mango Market');
        const shopId2 = await mangoShopper.createShop('Max Mangos');

        const createDeals = [
            mangoShopper.createDeal(shopId1, 5, 38),
            mangoShopper.createDeal(shopId2, 4, 35),
            mangoShopper.createDeal(shopId1, 4, 28),
            mangoShopper.createDeal(shopId1, 3, 28),
            mangoShopper.createDeal(shopId2, 2, 28),
            mangoShopper.createDeal(shopId1, 1, 28),
            mangoShopper.createDeal(shopId1, 3, 32),
            mangoShopper.createDeal(shopId1, 2, 28)];

        await Promise.all(createDeals);

        const topFiveDeals = await mangoShopper.topFiveDeals();

        assert.equal(5, topFiveDeals.length);

        const expectedDeals = [
            {
                "price": "28.00",
                "qty": 4,
                "shop_name": "Mango Market",
                "unit_price": "7.00",
            },
            {
                "price": "38.00",
                "qty": 5,
                "shop_name": "Mango Market",
                "unit_price": "7.60",
            },
            {
                "price": "35.00",
                "qty": 4,
                "shop_name": "Max Mangos",
                "unit_price": "8.75"
            },
            {
                "price": "28.00",
                "qty": 3,
                "shop_name": "Mango Market",
                "unit_price": "9.33"
            },
            {
                "price": "32.00",
                "qty": 3,
                "shop_name": "Mango Market",
                "unit_price": "10.67"
            }
        ];

        assert.deepStrictEqual(expectedDeals, topFiveDeals)

    });


    it('should return the recommeded deals', async function () {

        const mangoShopper = MangoShopper(db);

        const shopId1 = await mangoShopper.createShop('Mango Market');
        const shopId2 = await mangoShopper.createShop('Max Mangos');

        const createDeals = [
            mangoShopper.createDeal(shopId1, 5, 40),
            mangoShopper.createDeal(shopId2, 4, 35),
            mangoShopper.createDeal(shopId1, 4, 28),
            mangoShopper.createDeal(shopId1, 3, 28),
            mangoShopper.createDeal(shopId2, 2, 25),
            mangoShopper.createDeal(shopId1, 1, 15),
            mangoShopper.createDeal(shopId1, 3, 32)];

        await Promise.all(createDeals);

        const recommendDeals = await mangoShopper.recommendDeals(30);

        assert.equal(4, recommendDeals.length);

        const expectedDeals = [

            {
                "name": "Mango Market",
                "price": "28.00",
                "qty": 4,
                "unit_price": "7.00"
            },
            {
                "name": "Mango Market",
                "price": "28.00",
                "qty": 3,
                "unit_price": "9.33"
            },
            {
                "name": "Max Mangos",
                "price": "25.00",
                "qty": 2,
                "unit_price": "12.50"
            },
            {
                "name": "Mango Market",
                "price": "15.00",
                "qty": 1,
                "unit_price": "15.00"
            }
        ];

        assert.deepStrictEqual(expectedDeals, recommendDeals)

    });


    after(function () {
        db.$pool.end()
    });

});