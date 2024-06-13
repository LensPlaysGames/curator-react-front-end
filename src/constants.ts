const inDevEnvironment = process.env.NODE_ENV === "development";

export const HOSTNAME = inDevEnvironment ? "http://localhost:3000" : "https://curator-vsp.web.app";
