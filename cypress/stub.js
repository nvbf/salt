const deferred = require("./deferred");

export function createStub({ apiPath, fixturePath, handleRes = res => res }) {
  const response = deferred();
  cy.fixture(fixturePath).then(results => {
    results = handleRes(results);
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
