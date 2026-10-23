const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json({ limit: "10kb" }));

const packages = [
  { id: "diamond-11", name: "11 Diamonds", price: 2000 },
  { id: "diamond-56", name: "56 Diamonds", price: 5000 },
  { id: "diamond-114", name: "114 Diamonds", price: 10000 }
];

let nextOrder = 1001;
const orders = new Map();

app.get("/", (req, res) => {
  res.json({
    shop: "Peter Game Shop",
    mode: "DEMO",
    realTopUp: false,
    paymentTaken: false
  });
});

app.get("/api/packages", (req, res) => {
  res.json({
    demo: true,
    realTopUp: false,
    packages
  });
});

app.post("/api/orders", (req, res) => {
  const { packageId, playerId, serverId } = req.body || {};

  if (
    typeof playerId !== "string" ||
    typeof serverId !== "string" ||
    !/^\d{5,20}$/.test(playerId) ||
    !/^\d{1,10}$/.test(serverId)
  ) {
    return res.status(400).json({
      error: "Invalid Player ID or Server ID",
      demo: true
    });
  }

  const selected = packages.find(p => p.id === packageId);

  if (!selected) {
    return res.status(400).json({
      error: "Package not found",
      demo: true
    });
  }

  const order = {
    orderId: `DEMO-${nextOrder++}`,
    packageId: selected.id,
    packageName: selected.name,
    demoPrice: selected.price,
    playerId,
    serverId,
    status: "SIMULATED",
    realTopUp: false,
    paymentTaken: false
  };

  orders.set(order.orderId, order);
  res.status(201).json(order);
});

app.get("/api/orders/:orderId", (req, res) => {
  const order = orders.get(req.params.orderId);

  if (!order) {
    return res.status(404).json({
      error: "Demo order not found"
    });
  }

  res.json(order);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Peter Game Shop Demo API running on ${PORT}`);
});
