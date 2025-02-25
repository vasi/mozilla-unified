// |jit-test| --ion-warmup-threshold=20

function testBailout() {
  function f(v, r) {
    for (var i = 0; i < 50; ++i) {
      // Ensure DCE and LICM don't eliminate exponentiation when the power is negative.
      if (i === 0) {
        r();
      }
      1_0000_0000_0000_0000n ** v;
      1_0000_0000_0000_0000n ** v;
      1_0000_0000_0000_0000n ** v;
    }
  }

  var result = [];
  function r() {
    result.push("ok");
  }

  do {
    result.length = 0;
    try {
      f(1n, r);
      f(1n, r);
      f(-1n, r);
    } catch (e) {}
    assertEq(result.length, 3);
  } while (!inIon());
}
testBailout();
