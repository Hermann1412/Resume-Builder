import "dotenv/config";
import "dotenv/config";
import { enhanceProfessionalSummary } from "../controllers/aiController.js";

const req = {
  body: {
    userContent:
      "web dev with 6 years of experience building complex web apps using react js , node js, mongo db ...",
  },
};

const res = {
  statusCode: 200,
  payload: null,
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(data) {
    this.payload = data;
    return data;
  },
};

await enhanceProfessionalSummary(req, res);

const output = res?.payload?.enhancedContent || "";
const words = String(output).trim().split(/\s+/).filter(Boolean).length;

console.log("status:", res.statusCode);
console.log("fallback:", Boolean(res?.payload?.fallback));
console.log("message:", res?.payload?.message || "(none)");
console.log("words:", words);
console.log("output:\n", output);
