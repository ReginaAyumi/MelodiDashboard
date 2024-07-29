import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import clientRoutes from "./routes/client.js";
import managementRoutes from "./routes/management.js";
import salesRoutes from "./routes/sales.js";
import generalRoutes from "./routes/general.js";
import coreRoutes from "./routes/core.js";
import additionalRoutes from "./routes/additional.js";
import adminsRoutes from "./routes/admins.js";
import authRoutes from "./routes/auth.js";
import { WebSocketServer, WebSocket } from "ws";
import { Age_Daily, Age_Min, Age_Week } from "./models/Age.js";
import { Gender_Daily, Gender_Min, Gender_Week } from "./models/Gender.js";
import {
  Expression_Daily,
  Expression_Min,
  Expression_Week,
} from "./models/Expression.js";
import { Race_Daily, Race_Min, Race_Week } from "./models/Race.js";
import { Luggage_Daily, Luggage_Min, Luggage_Week } from "./models/Luggage.js";
import Visitor from "./models/Visitor.js";
import ClickStream from "./models/ClickStream.js";
import { dataClickStream } from "./data/dataDummy.js";

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

// Routes
app.use("/client", clientRoutes);
app.use("/management", managementRoutes);
app.use("/sales", salesRoutes);
app.use("/general", generalRoutes);
app.use("/core", coreRoutes);
app.use("/additional", additionalRoutes);
app.use("/admins", adminsRoutes);
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 9000;

// Mulai server Express
const server = app.listen(PORT, () => {
  console.log(`Server berjalan di port: ${PORT}`);
});

// WebSocket setup
const wss = new WebSocketServer({
  server,
});

const broadcast = (data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

const fetchData = async (dataType) => {
  let result;
  try {
    switch (dataType) {
      case "agedaily":
        result = await Age_Daily.aggregate([
          {
            $group: {
              _id: "$tanggal",
              totalAnak: { $sum: "$anak" },
              totalRemaja: { $sum: "$remaja" },
              totalDewasa: { $sum: "$dewasa" },
              totalLansia: { $sum: "$lansia" },
            },
          },
          { $sort: { _id: 1 } },
        ]);
        break;
      case "ageminute":
        result = await Age_Min.aggregate([
          {
            $group: {
              _id: "$minute",
              totalAnak: { $sum: "$anak" },
              totalRemaja: { $sum: "$remaja" },
              totalDewasa: { $sum: "$dewasa" },
              totalLansia: { $sum: "$lansia" },
            },
          },
          { $sort: { _id: 1 } },
        ]);
        break;
      case "ageweekly":
        result = await Age_Week.aggregate([
          {
            $group: {
              _id: "$week",
              totalAnak: { $sum: "$anak" },
              totalRemaja: { $sum: "$remaja" },
              totalDewasa: { $sum: "$dewasa" },
              totalLansia: { $sum: "$lansia" },
            },
          },
          { $sort: { _id: 1 } },
        ]);
        break;
      case "genderdaily":
        result = await Gender_Daily.aggregate([
          {
            $group: {
              _id: "$tanggal",
              totalPria: { $sum: "$pria" },
              totalWanita: { $sum: "$wanita" },
            },
          },
          { $sort: { _id: 1 } },
        ]);
        break;
      case "genderminute":
        result = await Gender_Min.aggregate([
          {
            $group: {
              _id: "$minute",
              totalPria: { $sum: "$pria" },
              totalWanita: { $sum: "$wanita" },
            },
          },
          { $sort: { _id: 1 } },
        ]);
        break;
      case "genderweekly":
        result = await Gender_Week.aggregate([
          {
            $group: {
              _id: "$week",
              totalPria: { $sum: "$pria" },
              totalWanita: { $sum: "$wanita" },
            },
          },
          { $sort: { _id: 1 } },
        ]);
        break;
      case "expressiondaily":
        result = await Expression_Daily.aggregate([
          {
            $group: {
              _id: "$tanggal",
              totalMarah: { $sum: "$marah" },
              totalRisih: { $sum: "$risih" },
              totalTakut: { $sum: "$takut" },
              totalSenyum: { $sum: "$senyum" },
              totalNetral: { $sum: "$netral" },
              totalSedih: { $sum: "$sedih" },
              totalTerkejut: { $sum: "$terkejut" },
            },
          },
          { $sort: { _id: 1 } },
        ]);
        break;
      case "expressionminute":
        result = await Expression_Min.aggregate([
          {
            $group: {
              _id: "$minute",
              totalMarah: { $sum: "$marah" },
              totalRisih: { $sum: "$risih" },
              totalTakut: { $sum: "$takut" },
              totalSenyum: { $sum: "$senyum" },
              totalNetral: { $sum: "$netral" },
              totalSedih: { $sum: "$sedih" },
              totalTerkejut: { $sum: "$terkejut" },
            },
          },
          { $sort: { _id: 1 } },
        ]);
        break;
      case "expressionweekly":
        result = await Expression_Week.aggregate([
          {
            $group: {
              _id: "$week",
              totalMarah: { $sum: "$marah" },
              totalRisih: { $sum: "$risih" },
              totalTakut: { $sum: "$takut" },
              totalSenyum: { $sum: "$senyum" },
              totalNetral: { $sum: "$netral" },
              totalSedih: { $sum: "$sedih" },
              totalTerkejut: { $sum: "$terkejut" },
            },
          },
          { $sort: { _id: 1 } },
        ]);
        break;
      case "racedaily":
        result = await Race_Daily.aggregate([
          {
            $group: {
              _id: "$tanggal",
              totalNegroid: { $sum: "$negroid" },
              totalEastAsian: { $sum: "$east_asian" },
              totalIndian: { $sum: "$indian" },
              totalLatin: { $sum: "$latin" },
              totalMiddleEastern: { $sum: "$middle_eastern" },
              totalSouthEastAsian: { $sum: "$south_east_asian" },
              totalKaukasia: { $sum: "$kaukasia" },
            },
          },
          { $sort: { _id: 1 } },
        ]);
        break;
      case "raceminute":
        result = await Race_Min.aggregate([
          {
            $group: {
              _id: "$minute",
              totalNegroid: { $sum: "$negroid" },
              totalEastAsian: { $sum: "$east_asian" },
              totalIndian: { $sum: "$indian" },
              totalLatin: { $sum: "$latin" },
              totalMiddleEastern: { $sum: "$middle_eastern" },
              totalSouthEastAsian: { $sum: "$south_east_asian" },
              totalKaukasia: { $sum: "$kaukasia" },
            },
          },
          { $sort: { _id: 1 } },
        ]);
        break;
      case "raceweekly":
        result = await Race_Week.aggregate([
          {
            $group: {
              _id: "$week",
              totalNegroid: { $sum: "$negroid" },
              totalEastAsian: { $sum: "$east_asian" },
              totalIndian: { $sum: "$indian" },
              totalLatin: { $sum: "$latin" },
              totalMiddleEastern: { $sum: "$middle_eastern" },
              totalSouthEastAsian: { $sum: "$south_east_asian" },
              totalKaukasia: { $sum: "$kaukasia" },
            },
          },
          { $sort: { _id: 1 } },
        ]);
        break;
      case "luggagedaily":
        result = await Luggage_Daily.aggregate([
          {
            $group: {
              _id: "$tanggal",
              totalManusia: { $sum: "$manusia" },
              totalBesar: { $sum: "$besar" },
              totalSedang: { $sum: "$sedang" },
              totalKecil: { $sum: "$kecil" },
            },
          },
          { $sort: { _id: 1 } },
        ]);
        break;
      case "luggageminute":
        result = await Luggage_Min.aggregate([
          {
            $group: {
              _id: "$minute",
              totalManusia: { $sum: "$manusia" },
              totalBesar: { $sum: "$besar" },
              totalSedang: { $sum: "$sedang" },
              totalKecil: { $sum: "$kecil" },
            },
          },
          { $sort: { _id: 1 } },
        ]);
        break;
      case "luggageweekly":
        result = await Luggage_Week.aggregate([
          {
            $group: {
              _id: "$week",
              totalManusia: { $sum: "$manusia" },
              totalBesar: { $sum: "$besar" },
              totalSedang: { $sum: "$sedang" },
              totalKecil: { $sum: "$kecil" },
            },
          },
          { $sort: { _id: 1 } },
        ]);
        break;
      default:
        throw new Error("Unknown data type");
    }
    console.log("Fetched data from MongoDB:", result); // Add this line to log the fetched data
    return result;
  } catch (error) {
    console.error("Error fetching data:", error); // Log any errors that occur during data fetching
    throw error;
  }
};

wss.on("connection", (ws) => {
  console.log("New client connected");

  ws.on("message", async (message) => {
    const data = JSON.parse(message);
    console.log("Received message from client:", data);
    switch (data.type) {
      case "INITIAL_DAILY_AGE_DATA":
        try {
          const agedailyResult = await fetchData("agedaily");
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(
              JSON.stringify({
                type: "INITIAL_DATA",
                payload: { agedaily: agedailyResult },
              })
            );
          }
        } catch (error) {
          console.error("Error fetching daily age data:", error);
        }
        break;
      case "INITIAL_MINUTE_AGE_DATA":
        try {
          const ageminuteResult = await fetchData("ageminute");
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(
              JSON.stringify({
                type: "INITIAL_DATA",
                payload: { ageminute: ageminuteResult },
              })
            );
          }
        } catch (error) {
          console.error("Error fetching minute age data:", error);
        }
        break;
      case "INITIAL_WEEKLY_AGE_DATA":
        try {
          const ageweeklyResult = await fetchData("ageweekly");
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(
              JSON.stringify({
                type: "INITIAL_DATA",
                payload: { ageweekly: ageweeklyResult },
              })
            );
          }
        } catch (error) {
          console.error("Error fetching weekly age data:", error);
        }
        break;
      case "INITIAL_DAILY_GENDER_DATA":
        try {
          const genderdailyResult = await fetchData("genderdaily");
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(
              JSON.stringify({
                type: "INITIAL_DATA",
                payload: { genderdaily: genderdailyResult },
              })
            );
          }
        } catch (error) {
          console.error("Error fetching daily gender data:", error);
        }
        break;
      case "INITIAL_MINUTE_GENDER_DATA":
        try {
          const genderminuteResult = await fetchData("genderminute");
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(
              JSON.stringify({
                type: "INITIAL_DATA",
                payload: { genderminute: genderminuteResult },
              })
            );
          }
        } catch (error) {
          console.error("Error fetching minute gender data:", error);
        }
        break;
      case "INITIAL_WEEKLY_GENDER_DATA":
        try {
          const genderweeklyResult = await fetchData("genderweekly");
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(
              JSON.stringify({
                type: "INITIAL_DATA",
                payload: { genderweekly: genderweeklyResult },
              })
            );
          }
        } catch (error) {
          console.error("Error fetching weekly gender data:", error);
        }
        break;
      case "INITIAL_DAILY_EXPRESSION_DATA":
        try {
          const expressiondailyResult = await fetchData("expressiondaily");
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(
              JSON.stringify({
                type: "INITIAL_DATA",
                payload: { expressiondaily: expressiondailyResult },
              })
            );
          }
        } catch (error) {
          console.error("Error fetching daily expression data:", error);
        }
        break;
      case "INITIAL_MINUTE_EXPRESSION_DATA":
        try {
          const expressionminuteResult = await fetchData("expressionminute");
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(
              JSON.stringify({
                type: "INITIAL_DATA",
                payload: { expressionminute: expressionminuteResult },
              })
            );
          }
        } catch (error) {
          console.error("Error fetching minute expression data:", error);
        }
        break;
      case "INITIAL_WEEKLY_EXPRESSION_DATA":
        try {
          const expressionweeklyResult = await fetchData("expressionweekly");
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(
              JSON.stringify({
                type: "INITIAL_DATA",
                payload: { expressionweekly: expressionweeklyResult },
              })
            );
          }
        } catch (error) {
          console.error("Error fetching weekly expression data:", error);
        }
        break;
      case "INITIAL_DAILY_RACE_DATA":
        try {
          const racedailyResult = await fetchData("racedaily");
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(
              JSON.stringify({
                type: "INITIAL_DATA",
                payload: { racedaily: racedailyResult },
              })
            );
          }
        } catch (error) {
          console.error("Error fetching daily race data:", error);
        }
        break;
      case "INITIAL_MINUTE_RACE_DATA":
        try {
          const raceminuteResult = await fetchData("raceminute");
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(
              JSON.stringify({
                type: "INITIAL_DATA",
                payload: { raceminute: raceminuteResult },
              })
            );
          }
        } catch (error) {
          console.error("Error fetching minute race data:", error);
        }
        break;
      case "INITIAL_WEEKLY_RACE_DATA":
        try {
          const raceweeklyResult = await fetchData("raceweekly");
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(
              JSON.stringify({
                type: "INITIAL_DATA",
                payload: { raceweekly: raceweeklyResult },
              })
            );
          }
        } catch (error) {
          console.error("Error fetching weekly race data:", error);
        }
        break;
      case "INITIAL_DAILY_LUGGAGE_DATA":
        try {
          const luggagedailyResult = await fetchData("luggagedaily");
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(
              JSON.stringify({
                type: "INITIAL_DATA",
                payload: { luggagedaily: luggagedailyResult },
              })
            );
          }
        } catch (error) {
          console.error("Error fetching daily luggage data:", error);
        }
        break;
      case "INITIAL_MINUTE_LUGGAGE_DATA":
        try {
          const luggageminuteResult = await fetchData("luggageminute");
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(
              JSON.stringify({
                type: "INITIAL_DATA",
                payload: { luggageminute: luggageminuteResult },
              })
            );
          }
        } catch (error) {
          console.error("Error fetching minute luggage data:", error);
        }
        break;
      case "INITIAL_WEEKLY_LUGGAGE_DATA":
        try {
          const luggageweeklyResult = await fetchData("luggageweekly");
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(
              JSON.stringify({
                type: "INITIAL_DATA",
                payload: { luggageweekly: luggageweeklyResult },
              })
            );
          }
        } catch (error) {
          console.error("Error fetching weekly luggage data:", error);
        }
        break;
      default:
        console.error("Unknown message type:", data.type);
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

const dailyageChangeStream = Age_Daily.watch();
const minuteageChangeStream = Age_Min.watch();
const weeklyageChangeStream = Age_Week.watch();
const dailygenderChangeStream = Gender_Daily.watch();
const minutegenderChangeStream = Gender_Min.watch();
const weeklygenderChangeStream = Gender_Week.watch();
const dailyexpressionChangeStream = Expression_Daily.watch();
const minuteexpressionChangeStream = Expression_Min.watch();
const weeklyexpressionChangeStream = Expression_Week.watch();
const dailyraceChangeStream = Race_Daily.watch();
const minuteraceChangeStream = Race_Min.watch();
const weeklyraceChangeStream = Race_Week.watch();
const dailyluggageChangeStream = Luggage_Daily.watch();
const minuteluggageChangeStream = Luggage_Min.watch();
const weeklyluggageChangeStream = Luggage_Week.watch();
// Add more change streams as needed, for example:
// const weeklyChangeStream = Race_Weekly.watch();
// Daily change stream

dailyageChangeStream.on("change", async (change) => {
  console.log("Daily age database change detected:", change);

  const agedailyData = await fetchData("agedaily");

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({
          type: "DATA",
          payload: {
            agedaily: agedailyData,
          },
        })
      );
    }
  });
});

minuteageChangeStream.on("change", async (change) => {
  console.log("Minute age database change detected:", change);

  const ageminuteData = await fetchData("ageminute");

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({
          type: "DATA",
          payload: {
            ageminute: ageminuteData,
          },
        })
      );
    }
  });
});

weeklyageChangeStream.on("change", async (change) => {
  console.log("Weekly age database change detected:", change);

  const ageweeklyData = await fetchData("ageweekly");

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({
          type: "DATA",
          payload: {
            ageweekly: ageweeklyData,
          },
        })
      );
    }
  });
});

dailygenderChangeStream.on("change", async (change) => {
  console.log("Daily gender database change detected:", change);

  const genderdailyData = await fetchData("genderdaily");

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({
          type: "DATA",
          payload: {
            genderdaily: genderdailyData,
          },
        })
      );
    }
  });
});

minutegenderChangeStream.on("change", async (change) => {
  console.log("Minute gender database change detected:", change);

  const genderminuteData = await fetchData("genderminute");

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({
          type: "DATA",
          payload: {
            genderminute: genderminuteData,
          },
        })
      );
    }
  });
});

weeklygenderChangeStream.on("change", async (change) => {
  console.log("Weekly gender database change detected:", change);

  const genderweeklyData = await fetchData("genderweekly");

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({
          type: "DATA",
          payload: {
            genderweekly: genderweeklyData,
          },
        })
      );
    }
  });
});

dailyexpressionChangeStream.on("change", async (change) => {
  console.log("Daily expression database change detected:", change);

  const expressiondailyData = await fetchData("expressiondaily");

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({
          type: "DATA",
          payload: {
            expressiondaily: expressiondailyData,
          },
        })
      );
    }
  });
});

minuteexpressionChangeStream.on("change", async (change) => {
  console.log("Minute expression database change detected:", change);

  const expressionminuteData = await fetchData("expressionminute");

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({
          type: "DATA",
          payload: {
            expressionminute: expressionminuteData,
          },
        })
      );
    }
  });
});

weeklyexpressionChangeStream.on("change", async (change) => {
  console.log("Weekly expression database change detected:", change);

  const expressionweeklyData = await fetchData("expressionweekly");

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({
          type: "DATA",
          payload: {
            expressionweekly: expressionweeklyData,
          },
        })
      );
    }
  });
});

dailyraceChangeStream.on("change", async (change) => {
  console.log("Daily race database change detected:", change);

  const racedailyData = await fetchData("racedaily");

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({
          type: "DATA",
          payload: {
            racedaily: racedailyData,
          },
        })
      );
    }
  });
});

// Minute change stream
minuteraceChangeStream.on("change", async (change) => {
  console.log("Minute  race database change detected:", change);

  const raceminuteData = await fetchData("raceminute");

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({
          type: "DATA",
          payload: {
            raceminute: raceminuteData,
          },
        })
      );
    }
  });
});

weeklyraceChangeStream.on("change", async (change) => {
  console.log("Weekly race database change detected:", change);

  const raceweeklyData = await fetchData("raceweekly");

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({
          type: "DATA",
          payload: {
            raceweekly: raceweeklyData,
          },
        })
      );
    }
  });
});

dailyluggageChangeStream.on("change", async (change) => {
  console.log("Daily luggage database change detected:", change);

  const luggagedailyData = await fetchData("luggagedaily");

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({
          type: "DATA",
          payload: {
            luggagedaily: luggagedailyData,
          },
        })
      );
    }
  });
});

minuteluggageChangeStream.on("change", async (change) => {
  console.log("Minute luggage database change detected:", change);

  const luggageminuteData = await fetchData("luggageminute");

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({
          type: "DATA",
          payload: {
            luggageminute: luggageminuteData,
          },
        })
      );
    }
  });
});

weeklyluggageChangeStream.on("change", async (change) => {
  console.log("Weekly luggage database change detected:", change);

  const luggageweeklyData = await fetchData("luggageweekly");

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({
          type: "DATA",
          payload: {
            luggageweekly: luggageweeklyData,
          },
        })
      );
    }
  });
});

// Mongoose setup
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("Terhubung ke MongoDB");

    // Uncomment the following lines to seed the database
    // await RaceDaily.insertMany(dataDaily);
    // await RaceMinute.insertMany(dataMinute);
    // await RaceWeek.insertMany(dataWeekly);
    // ClickStream.insertMany(dataClickStream);

    // Verifikasi data dalam koleksi
    const dataRaceDaily = await Race_Daily.find({});
    const dataRaceMinute = await Race_Min.find({});
    const dataRaceWeekly = await Race_Week.find({});
    const dataLuggageDaily = await Luggage_Daily.find({});
    const dataAgeDaily = await Age_Daily.find({});
    const dataGenderDaily = await Gender_Daily.find({});
    const dataExpressionDaily = await Expression_Daily.find({});
    console.log("Daily Data: ", dataRaceDaily);
    console.log("Minute Data: ", dataRaceMinute);
    console.log("Weekly Data: ", dataRaceWeekly);
    console.log("Daily Luggage Data: ", dataLuggageDaily);
    console.log("Daily Age Data: ", dataAgeDaily);
    console.log("Daily Gender Data: ", dataGenderDaily);
    console.log("Daily Expression Data: ", dataExpressionDaily);
  })
  .catch((error) => console.log(`${error} tidak terhubung: ${error.message}`));
