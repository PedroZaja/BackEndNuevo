import chai from "chai";
import supertest from "supertest";
import mongoose from "mongoose";
import { generateMockProduct } from "../src/util.js";

const expect = chai.expect;
const requester = supertest('http://localhost:4000');

describe("Pruebas!", () => {

    before(async function () {
        this.cookie;
    });

    describe("Session API Test", () => {

        before(async function () {
            // this.cookie;
            this.mockUser = {
                email: "algunmail@gmail.com",
                password: "algunapass",
                first_name: "algunnombre",
                last_name: "algunapellido",
                age: 25,
                role: "admin"
            }
        });

        /*         beforeEach(function(){
                    this.timeout(4000);
                    mongoose.connection.collections.users.drop();
                }); */

        it("Register user - POST /api/sessions/register", async function () {
            const { statusCode, ok, _body } = await requester.post("/api/sessions/register").send(this.mockUser);
            expect(statusCode).to.be.eql(201)
            expect(_body.message).to.be.deep.equal('Success')
        });

        it("Login user and set cookie- POST /api/sessions/login", async function () {

            const result = await requester.post("/api/sessions/login").send({ email: this.mockUser.email, password: this.mockUser.password });
            const cookieResult = result.headers['set-cookie'][0];

            expect(result.statusCode).to.be.eql(200)
            expect(result._body.success).to.be.ok

            const cookieData = cookieResult.split('=');
            this.cookie = {
                name: cookieData[0],
                value: cookieData[1]
            };

            expect(this.cookie.name).to.be.ok.and.eql('jwtCookieToken');
            expect(this.cookie.value).to.be.ok
        });

        it("Endpoint Current have a user with cookie - GET /api/sessions/current", async function () {
            const { _body, } = await requester.get("/api/sessions/current").set("Cookie", [`${this.cookie.name}=${this.cookie.value}`])
            expect(_body.email).to.be.ok.and.eql("algunmail@gmail.com")

        });

    });

    describe("Product API Test", () => {

        describe("User is logged and have role", () => {

            it("Create a product if you are logged in and with admin or premium role - POST /api/products/", async function () {

                const productMock = generateMockProduct()
                expect(this.cookie.name).to.be.ok.and.eql('jwtCookieToken');

                const { statusCode, ok } = await requester.post("/api/products").set('Cookie', [`${this.cookie.name}=${this.cookie.value}`]).send(productMock);
                expect(ok).to.be.ok;
                expect(statusCode).to.be.equal(201)
            });
        });

        describe("User is not logged", () => {

            it("If you want to create a product without logging in, should respond with a 400 status. - POST /api/products/", async function () {
                const productMock = generateMockProduct()

                const { statusCode, ok } = await requester.post("/api/products").send(productMock);
                expect(ok).to.be.not.ok;
                expect(statusCode).to.be.equal(401)
            });
        });
    });

});