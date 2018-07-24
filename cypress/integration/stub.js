const deferred = require("./deferred");

export function createStub({ apiPath, fixturePath }) {
  const response = deferred();
  cy.fixture(fixturePath).then(results => {
    response.resolve({
      json() {
        return results;
      },
      status: 200,
      ok: true
    });
  });

  return stubbedFetch => {
    stubbedFetch.withArgs(apiPath).returns(response.promise);
  };
}
