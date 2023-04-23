import handler from "@/pages/api/drink/ymlist";

import httpMocks from "node-mocks-http";
import { NextApiRequest, NextApiResponse } from "next";

describe("/api/drink handler", () => {
  test("responds 200 to GET", async () => {
    const req = httpMocks.createRequest<NextApiRequest>();
    const res = httpMocks.createResponse<NextApiResponse>();

    await handler(req, res);
    expect(res.statusCode).toBe(200);
  });
});
