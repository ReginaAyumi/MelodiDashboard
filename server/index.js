import express from "express";
import http from "http";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import adminsRoutes from "./routes/admins.js";
import authRoutes from "./routes/auth.js";
import { WebSocketServer, WebSocket } from "ws";
import FaceAnalytics from "./models/FaceAnalytics.js";
import recognizeRoutes from "./routes/recognize.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  cors({
    origin: "http://localhost:3000", // Sesuaikan dengan asal frontend Anda
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Add a basic route
app.get("/", (req, res) => {
  res.send("Server is running successfully!");
});

// Route untuk connect camera ke API face recognition
app.use("/api", recognizeRoutes);

// Endpoint untuk mengambil data admin
app.get('/admins/admin/:adminId', (req, res) => {
  const { adminId } = req.params;
  // Implementasi logika untuk mengambil data admin
  res.json({ adminId, name: 'Admin Name', role: 'Admin' });
});

// Routes
app.use("/admins", adminsRoutes);
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 5001;

// Mulai server Express

const server = app.listen(PORT, () => {
  console.log(`Server berjalan di port: ${PORT}`);
});

// console.log("Initializing WebSocket server...");
const wss = new WebSocketServer({ server });
// const wss = new WebSocket("ws://127.0.0.1:9000");
// console.log("WebSocket server is listening for connections...");

wss.onerror = (error) => {
  console.error("WebSocket error:", error);
};

const broadcast = (data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

// // Fungsi fetchData untuk mengambil data sesuai dengan tipe
// async function fetchData(type) {
//   switch (type) {
//     case "faceanalytics":
//       return await FaceAnalytics.find({}); // Sesuaikan query dengan kebutuhan
//     default:
//       throw new Error("Unknown data type");
//   }
// }

const getTodayStartEndTime = () => {
  // Mendapatkan tanggal hari ini
  const today = new Date();

  // Mengatur start time ke awal hari ini (00:00:00)
  const startTimeFrame = new Date(today.setHours(0, 0, 0, 0));

  // Mengatur end time ke akhir hari ini (23:59:59)
  const endTimeFrame = new Date(today.setHours(23, 59, 59, 999));

  // Mengembalikan kedua waktu
  return { startTimeFrame, endTimeFrame };
};

// Mendapatkan startTimeFrame dan endTimeFrame untuk hari ini
const { startTimeFrame, endTimeFrame } = getTodayStartEndTime();

console.log("Start Time: ", startTimeFrame);
console.log("End Time: ", endTimeFrame);

const fetchData = async (dataType, startTimeFrame, endTimeFrame) => {
  let result;
  try {
    // Define separate conditions for age, gender, and expression
    const ageCondition = {
      totalAnak: {
        $sum: {
          $cond: [
            { $and: [{ $gte: ["$age.value", 1] }, { $lte: ["$age.value", 11] }] },
            1,
            0,
          ],
        },
      },
      totalRemaja: {
        $sum: {
          $cond: [
            { $and: [{ $gte: ["$age.value", 12] }, { $lte: ["$age.value", 18] }] },
            1,
            0,
          ],
        },
      },
      totalDewasa: {
        $sum: {
          $cond: [
            { $and: [{ $gte: ["$age.value", 19] }, { $lte: ["$age.value", 59] }] },
            1,
            0,
          ],
        },
      },
      totalLansia: {
        $sum: {
          $cond: [{ $gte: ["$age.value", 60] }, 1, 0],
        },
      },
    };
    

    const genderCondition = {
      totalPria: {
        $sum: {
          $cond: [{ $eq: ["$gender", "laki-laki"] }, 1, 0],
        },
      },
      totalWanita: {
        $sum: {
          $cond: [{ $eq: ["$gender", "perempuan"] }, 1, 0],
        },
      },
    };

    const expressionCondition = {
      totalMarah: {
        $sum: {
          $cond: [{ $eq: ["$expression", "marah"] }, 1, 0],
        },
      },
      totalRisih: {
        $sum: {
          $cond: [{ $eq: ["$expression", "risih"] }, 1, 0],
        },
      },
      totalTakut: {
        $sum: {
          $cond: [{ $eq: ["$expression", "takut"] }, 1, 0],
        },
      },
      totalSenyum: {
        $sum: {
          $cond: [{ $eq: ["$expression", "senyum"] }, 1, 0],
        },
      },
      totalNetral: {
        $sum: {
          $cond: [{ $eq: ["$expression", "netral"] }, 1, 0],
        },
      },
      totalSedih: {
        $sum: {
          $cond: [{ $eq: ["$expression", "sedih"] }, 1, 0],
        },
      },
      totalTerkejut: {
        $sum: {
          $cond: [{ $eq: ["$expression", "terkejut"] }, 1, 0],
        },
      },
    };

    // Combine conditions into one object
    const groupCondition = {
      ...ageCondition,
      ...genderCondition,
      ...expressionCondition,
    };

    // Determine filter condition based on time frame
    const filterCondition = {};
    if (startTimeFrame && endTimeFrame) {
      filterCondition.createdAt = {
        $gte: new Date(startTimeFrame),  // greater than or equal to start time
        $lte: new Date(endTimeFrame),    // less than or equal to end time
      };
    }

    switch (dataType) {
      case "agedaily":
        result = await FaceAnalytics.aggregate([
          {
            $match: filterCondition,  // Filter data based on date range
          },
          {
            $group: {
              _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
              ...ageCondition,
            },
          },
          { $sort: { _id: 1 } },
        ]);
        break;

      case "ageminute":
        result = await FaceAnalytics.aggregate([
          {
            $match: filterCondition,  // Filter data based on date range
          },
          {
            $group: {
              _id: { $dateToString: { format: "%Y-%m-%d %H:%M", date: "$timestamp" } },
              ...ageCondition,
            },
          },
          { $sort: { _id: 1 } },
        ]);
        break;

      case "ageweekly":
        result = await FaceAnalytics.aggregate([
          {
            $match: filterCondition,  // Filter data based on date range
          },
          {
            $group: {
              _id: { $dateToString: { format: "%Y-%U", date: "$timestamp" } },
              ...ageCondition,
            },
          },
          { $sort: { _id: 1 } },
        ]);
        break;

      case "genderdaily":
        result = await FaceAnalytics.aggregate([
          {
            $match: filterCondition,  // Filter data based on date range
          },
          {
            $group: {
              _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
              ...genderCondition,
            },
          },
          { $sort: { _id: 1 } },
        ]);
        break;

      case "genderminute":
        result = await FaceAnalytics.aggregate([
          {
            $match: filterCondition,  // Filter data based on date range
          },
          {
            $group: {
              _id: { $dateToString: { format: "%Y-%m-%d %H:%M", date: "$timestamp" } },
              ...genderCondition,
            },
          },
          { $sort: { _id: 1 } },
        ]);
        break;

      case "genderweekly":
        result = await FaceAnalytics.aggregate([
          {
            $match: filterCondition,  // Filter data based on date range
          },
          {
            $group: {
              _id: { $dateToString: { format: "%Y-%U", date: "$timestamp" } },
              ...genderCondition,
            },
          },
          { $sort: { _id: 1 } },
        ]);
        break;

        case "expressiondaily":
        result = await FaceAnalytics.aggregate([
          {
            $match: filterCondition,  // Filter data based on date range
          },
          {
            $group: {
              _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
              ...expressionCondition,
            },
          },
          { $sort: { _id: 1 } },
        ]);
        break;

      case "expressionminute":
        result = await FaceAnalytics.aggregate([
          {
            $match: filterCondition,  // Filter data based on date range
          },
          {
            $group: {
              _id: { $dateToString: { format: "%Y-%m-%d %H:%M", date: "$timestamp" } },
              ...expressionCondition,
            },
          },
          { $sort: { _id: 1 } },
        ]);
        break;

      case "expressionweekly":
        result = await FaceAnalytics.aggregate([
          {
            $match: filterCondition,  // Filter data based on date range
          },
          {
            $group: {
              _id: { $dateToString: { format: "%Y-%U", date: "$timestamp" } },
              ...expressionCondition,
            },
          },
          { $sort: { _id: 1 } },
        ]);
        break;
      // Repeat the same for gender and expression cases...

      default:
        throw new Error("Unknown data type");
    }

    console.log("Fetched data from MongoDB:", result);
    return result;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};



wss.on("connection", (ws) => {
  console.log("New client connected");

  ws.on("message", async (message) => {
    const data = JSON.parse(message);
    console.log("Received message from client:", data);

    try {
      switch (data.type) {
        // Daily Age Data
        case "INITIAL_DAILY_AGE_DATA":
          const agedailyResult = await fetchData("agedaily");
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(
              JSON.stringify({
                type: "INITIAL_DATA",
                payload: { agedaily: agedailyResult },
              })
            );
          }
          break;

        // Minute Age Data
        case "INITIAL_MINUTE_AGE_DATA":
          const ageminuteResult = await fetchData("ageminute");
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(
              JSON.stringify({
                type: "INITIAL_DATA",
                payload: { ageminute: ageminuteResult },
              })
            );
          }
          break;

        // Weekly Age Data
        case "INITIAL_WEEKLY_AGE_DATA":
          const ageweeklyResult = await fetchData("ageweekly");
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(
              JSON.stringify({
                type: "INITIAL_DATA",
                payload: { ageweekly: ageweeklyResult },
              })
            );
          }
          break;

        // Daily Gender Data
        case "INITIAL_DAILY_GENDER_DATA":
          const genderdailyResult = await fetchData("genderdaily");
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(
              JSON.stringify({
                type: "INITIAL_DATA",
                payload: { genderdaily: genderdailyResult },
              })
            );
          }
          break;

        // Minute Gender Data
        case "INITIAL_MINUTE_GENDER_DATA":
          const genderminuteResult = await fetchData("genderminute");
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(
              JSON.stringify({
                type: "INITIAL_DATA",
                payload: { genderminute: genderminuteResult },
              })
            );
          }
          break;

        // Weekly Gender Data
        case "INITIAL_WEEKLY_GENDER_DATA":
          const genderweeklyResult = await fetchData("genderweekly");
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(
              JSON.stringify({
                type: "INITIAL_DATA",
                payload: { genderweekly: genderweeklyResult },
              })
            );
          }
          break;

        // Daily Expression Data
        case "INITIAL_DAILY_EXPRESSION_DATA":
          const expressiondailyResult = await fetchData("expressiondaily");
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(
              JSON.stringify({
                type: "INITIAL_DATA",
                payload: { expressiondaily: expressiondailyResult },
              })
            );
          }
          break;

        // Minute Expression Data
        case "INITIAL_MINUTE_EXPRESSION_DATA":
          const expressionminuteResult = await fetchData("expressionminute");
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(
              JSON.stringify({
                type: "INITIAL_DATA",
                payload: { expressionminute: expressionminuteResult },
              })
            );
          }
          break;

        // Weekly Expression Data
        case "INITIAL_WEEKLY_EXPRESSION_DATA":
          const expressionweeklyResult = await fetchData("expressionweekly");
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(
              JSON.stringify({
                type: "INITIAL_DATA",
                payload: { expressionweekly: expressionweeklyResult },
              })
            );
          }
          break;

        default:
          console.error("Unknown message type:", data.type);
      }
    } catch (error) {
      console.error(`Error fetching data for ${data.type}:`, error);
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});


// Helper function to setup a change stream with error handling and reconnection logic
function setupChangeStream(model, type, fetchDataFunction, wss) {
  const changeStream = model.watch();

  changeStream.on('change', async (change) => {
    console.log(`${type} database change detected:`, change);
    
    try {
      const data = await fetchDataFunction(type);
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: "DATA",
            payload: { [type]: data },
          }));
        }
      });
      // broadcast({
      //   type: "DATA",
      //   payload: { [type]: data },
      // });
    } catch (error) {
      console.error(`Error processing ${type} change:`, error);
    }
  });

  changeStream.on('error', (error) => {
    console.error(`${type} Change Stream Error:`, error);
    changeStream.close(); // Close the current change stream
    // Reconnect logic with a delay
    setTimeout(() => setupChangeStream(model, type, fetchDataFunction, wss), 1000);
  });

  return changeStream;
}

// Define your model and corresponding data type
const modelsAndTypes = [
  { model: FaceAnalytics, type: 'faceanalytics' },
];

// Setup change streams for all models
modelsAndTypes.forEach(({ model, type }) => setupChangeStream(model, type, fetchData, wss));

FaceAnalytics.watch().on("change", (change) => {
  broadcast({ type: "DATA_UPDATED", payload: change });
});

// Mongoose setup
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("Terhubung ke MongoDB");
  })
  .catch((error) => console.log(`${error} tidak terhubung: ${error.message}`));