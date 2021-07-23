const {
  calculateTip,
  celsiusToFahrenheit,
  fahrenheitToCelsius,
  asyncAdd,
} = require("./math");

describe("calculateTip gives the total with a tips percentage", () => {
  it("should calculate the total, tips included", () => {
    expect(calculateTip(10, 20)).toBe(12);
    expect(calculateTip(20, 20)).toBe(24);
  });

  it("should calculate the total, without the second argument to precise to percentage of tips", () => {
    expect(calculateTip(20)).toBe(23);
  });
});

describe("celsiusToFahrenheit converts celsius to fahrenheit unit", () => {
  it("should returns NaN without argument", () => {
    expect(celsiusToFahrenheit()).toBeNaN();
  });

  it("should return the converted unit in celsius", () => {
    expect(celsiusToFahrenheit(5)).toBe(41);
  });
});

describe("fahrenheitToCelsius converts fahrenheit to celsius unit", () => {
  it("should returns NaN without argument", () => {
    expect(fahrenheitToCelsius()).toBeNaN();
  });

  it("should return the converted unit in fahrenheit", () => {
    expect(fahrenheitToCelsius(41)).toBe(5);
  });
});

test("async test demo", async () => {
  const result = await asyncAdd(2, 5);
  expect(result).toBe(7);
});
