const assert = require("assert");
const PasswordHelper = require("../helpers/passwordHelpers");
const SENHA = "Ananda@313131";
const HASH = " $2b$04$bD1wiexHV1vhi/BEjbLFNOuLG4XfCKxKwIPyiGdjEfW35Wyws2lkm";

describe("UserHelper test suite", function () {
    it("Deve gerar um hash a partir de uma senha", async () => {
        const result = await PasswordHelper.hashPassword(SENHA);
        assert.ok(result.length > 10);
    });

    it("Deve comparar uma senha com seu hash", async () => {
        const result = await PasswordHelper.comparePassword(SENHA, HASH);
        assert.ok(result);
    });
});
