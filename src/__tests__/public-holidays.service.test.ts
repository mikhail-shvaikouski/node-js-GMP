import request from "supertest";
import axios, { AxiosStatic } from "axios";
import {
  getListOfPublicHolidays,
  checkIfTodayIsPublicHoliday,
  getNextPublicHolidays,
} from "../services/public-holidays.service";
import * as helpers from "../helpers";
import { PUBLIC_HOLIDAYS_API_URL } from "../config";

jest.mock("axios");

const axiosMock = axios as jest.Mocked<AxiosStatic>;
const validateInputMock = jest.spyOn(helpers, "validateInput");

const YEAR = 2023;
const COUNTRY = "DE";

const MOCK_DATA = {
  name: "Holiday 1",
  localName: "Holiday 1",
  date: "2023-01-01",
  countryCode: "GB",
  fixed: true,
  global: false,
  counties: null,
  launchYear: 2023,
  types: ["data", "number"],
};

const RESULT = {
  name: "Holiday 1",
  localName: "Holiday 1",
  date: "2023-01-01",
};

describe("Public Holidays Service", () => {
  // Tasks 1 & 3

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("Service should return a list of public holidays for a given year and country", async () => {
    axiosMock.get.mockResolvedValueOnce({
      data: [MOCK_DATA],
    });

    const result = await getListOfPublicHolidays(YEAR, COUNTRY);

    expect(result).toEqual([RESULT]);
  });

  it("Service should return an empty array and handle error when API call fails", async () => {
    validateInputMock.mockReturnValue(true);
    axios.get = jest.fn(async (url: string) => {
      throw new Error("API Error");
    });

    const result = await getListOfPublicHolidays(YEAR, COUNTRY);

    expect(result).toEqual([]);
    validateInputMock.mockRestore();
  });

  it("Service should check if today is a public holiday for a given country", async () => {
    axiosMock.get.mockResolvedValueOnce({ status: 200 });

    const result = await checkIfTodayIsPublicHoliday(COUNTRY);

    expect(result).toBe(true);
  });

  it("Service should return false and handle error when API call fails", async () => {
    validateInputMock.mockReturnValue(true);
    axios.get = jest.fn(async (url: string) => {
      throw new Error("API Error");
    });

    const result = await checkIfTodayIsPublicHoliday(COUNTRY);

    expect(result).toBe(false);
    validateInputMock.mockRestore();
  });

  it("Service should return the next public holidays for a given country", async () => {
    axiosMock.get.mockResolvedValueOnce({
      data: [MOCK_DATA],
    });

    const result = await getNextPublicHolidays(COUNTRY);

    expect(result).toEqual([RESULT]);
  });

  it("should return an empty array and handle error when API call fails", async () => {
    validateInputMock.mockReturnValue(true);
    axios.get = jest.fn(async (url: string) => {
      throw new Error("API Error");
    });

    const result = await getNextPublicHolidays(COUNTRY);

    expect(result).toEqual([]);
    validateInputMock.mockRestore();
  });
});

describe("Integration Tests for Public Holidays Service", () => {
  // Task 2 & 3

  it("Service should get a list of public holidays for a specific year and country", async () => {
    const { status, body } = await request(PUBLIC_HOLIDAYS_API_URL).get(
      `/PublicHolidays/${YEAR}/${COUNTRY}`
    );

    expect(status).toBe(200);
    expect(Array.isArray(body)).toBe(true);
    for (const holiday of body) {
      expect(holiday).toHaveProperty("date");
      expect(holiday).toHaveProperty("localName");
      expect(holiday).toHaveProperty("name");
      expect(holiday).toHaveProperty("countryCode");
      expect(holiday).toHaveProperty("fixed");
      expect(holiday).toHaveProperty("global");
      expect(holiday).toHaveProperty("counties");
      expect(holiday).toHaveProperty("launchYear");
      expect(holiday).toHaveProperty("types");
    }
  });

  it("Service should check if today is a public holiday for a specific country", async () => {
    const possibleStatusCodes = [200, 204];

    const { status } = await request(PUBLIC_HOLIDAYS_API_URL).get(
      `/IsTodayPublicHoliday/${COUNTRY}`
    );

    expect(possibleStatusCodes).toContain(status);
  });

  it("Service should get the next public holidays for a specific country", async () => {
    const { status, body } = await request(PUBLIC_HOLIDAYS_API_URL).get(
      `/NextPublicHolidays/${COUNTRY}`
    );

    expect(status).toBe(200);
    expect(Array.isArray(body)).toBe(true);

    for (const holiday of body) {
      expect(holiday).toHaveProperty("date");
      expect(holiday).toHaveProperty("localName");
      expect(holiday).toHaveProperty("name");
      expect(holiday).toHaveProperty("countryCode");
      expect(holiday).toHaveProperty("fixed");
      expect(holiday).toHaveProperty("global");
      expect(holiday).toHaveProperty("counties");
      expect(holiday).toHaveProperty("launchYear");
      expect(holiday).toHaveProperty("types");
    }
  });

  // Task 4
  it("Service should get version of the used Nager.Date library", async () => {
    const { status, body } = await request(PUBLIC_HOLIDAYS_API_URL).get(
      `/Version`
    );

    expect(status).toBe(200);
    expect(body).toHaveProperty("name");
    expect(body).toHaveProperty("version");
  });

  it("Service should get all available countries", async () => {
    const { status, body } = await request(PUBLIC_HOLIDAYS_API_URL).get(
      `/AvailableCountries`
    );

    expect(status).toBe(200);
    expect(Array.isArray(body)).toBe(true);

    for (const country of body) {
      expect(country).toHaveProperty("countryCode");
      expect(country).toHaveProperty("name");
    }
  });

  it("Service should returns the upcoming public holidays for the next 7 days", async () => {
    const { status, body } = await request(PUBLIC_HOLIDAYS_API_URL).get(
      `/NextPublicHolidaysWorldwide`
    );

    expect(status).toBe(200);
    expect(Array.isArray(body)).toBe(true);

    for (const holiday of body) {
      expect(holiday).toHaveProperty("date");
      expect(holiday).toHaveProperty("localName");
      expect(holiday).toHaveProperty("name");
      expect(holiday).toHaveProperty("countryCode");
      expect(holiday).toHaveProperty("fixed");
      expect(holiday).toHaveProperty("global");
      expect(holiday).toHaveProperty("counties");
      expect(holiday).toHaveProperty("launchYear");
      expect(holiday).toHaveProperty("types");
    }
  });
});
