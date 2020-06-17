const {describe} = require("mocha");
const {expect} = require("chai");

const {loadProject} = require("./src/lib/projectLib");

describe("Demo test: ", function() {
    it("1 === 1 should be true", function (){
        expect(1).to.equal(1);
    });
});

describe("Load project: ", function () {
    const id = "24328bdf-0bfe-47a6-b0a2-953ca6680ee8"; // testing project ID

    it("Project data is loaded", async function () {
        const loadedProject = await loadProject(id);
        expect(loadedProject.data).to.be.an("object");
    });
});