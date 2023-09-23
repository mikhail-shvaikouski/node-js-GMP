import { validateInput, shortenPublicHoliday } from "../helpers";

const YEAR = new Date().getFullYear();
const COUNTRY = "GB";

const MOCK_DATA = {
  name: "New Year",
  localName: "New Year",
  date: "2023-01-01",
  countryCode: "GB",
  fixed: true,
  global: false,
  counties: null,
  launchYear: 2023,
  types: ["data", "number"],
};

const RESULT = {
  name: "New Year",
  localName: "New Year",
  date: "2023-01-01",
};

describe("Helpers", () => {
  // Tasks 1

  describe("validateInput", () => {
    it("Helper should return true for valid input", () => {
      const input = { year: YEAR, country: COUNTRY };
      expect(validateInput(input)).toBe(true);
    });

    it("Helper should throw an error for an invalid country", () => {
      const input = {
        year: YEAR,
        country: "InvalidCountry",
      };
      expect(() => validateInput(input)).toThrowError(
        "Country provided is not supported"
      );
    });

    it("Helper should throw an error for an invalid year", () => {
      const input = { year: 1000, country: COUNTRY };
      expect(() => validateInput(input)).toThrowError(
        "Year provided not the current"
      );
    });
  });

  describe("Helper shortenPublicHoliday", () => {
    it("should shorten a public holiday", () => {
      const shortened = shortenPublicHoliday(MOCK_DATA);
      expect(shortened).toEqual(RESULT);
    });
  });
});
