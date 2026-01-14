const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "Stone of Righteousness API",
    version: "1.0.0",
    description: "API documentation for Stone-of-Righteousness",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Local server",
    },
  ],
  paths: {
    "/api/health": {
      get: {
        summary: "Health check",
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/HealthResponse" },
              },
            },
          },
        },
      },
    },
    "/api/items": {
      get: {
        summary: "List items",
        responses: {
          "200": {
            description: "List of items",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: { type: "array", items: { $ref: "#/components/schemas/Item" } },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Create item",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/NewItem" },
            },
          },
        },
        responses: {
          "201": {
            description: "Created",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Item" } } },
          },
          "400": { description: "Validation error" },
        },
      },
    },
    "/api/items/{id}": {
      get: {
        summary: "Get item by id",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          "200": { description: "Item", content: { "application/json": { schema: { $ref: "#/components/schemas/Item" } } } },
          "404": { description: "Not found" },
        },
      },
      put: {
        summary: "Update item",
        parameters: [ { name: "id", in: "path", required: true, schema: { type: "string" } } ],
        requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/NewItem" } } } },
        responses: { "200": { description: "Updated", content: { "application/json": { schema: { $ref: "#/components/schemas/Item" } } } }, "404": { description: "Not found" } },
      },
      delete: {
        summary: "Delete item",
        parameters: [ { name: "id", in: "path", required: true, schema: { type: "string" } } ],
        responses: { "204": { description: "Deleted" }, "404": { description: "Not found" } },
      },
    },
  },
  components: {
    schemas: {
      HealthResponse: {
        type: "object",
        properties: {
          status: { type: "string" },
          uptime: { type: "number" },
          timestamp: { type: "number" },
        },
      },
      Item: {
        type: "object",
        properties: {
          _id: { type: "string" },
          name: { type: "string" },
          description: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      NewItem: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string" },
          description: { type: "string" },
        },
      },
    },
  },
};

export default swaggerSpec;
