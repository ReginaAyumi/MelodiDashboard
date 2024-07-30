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

// Define your models and corresponding data types
const modelsAndTypes = [
  { model: Age_Daily, type: 'agedaily' },
  { model: Age_Min, type: 'ageminute' },
  { model: Age_Week, type: 'ageweekly' },
  { model: Gender_Daily, type: 'genderdaily' },
  { model: Gender_Min, type: 'genderminute' },
  { model: Gender_Week, type: 'genderweekly' },
  { model: Expression_Daily, type: 'expressiondaily' },
  { model: Expression_Min, type: 'expressionminute' },
  { model: Expression_Week, type: 'expressionweekly' },
  { model: Race_Daily, type: 'racedaily' },
  { model: Race_Min, type: 'raceminute' },
  { model: Race_Week, type: 'raceweekly' },
  { model: Luggage_Daily, type: 'luggagedaily' },
  { model: Luggage_Min, type: 'luggageminute' },
  { model: Luggage_Week, type: 'luggageweekly' },
];

// Setup change streams for all models
modelsAndTypes.forEach(({ model, type }) => setupChangeStream(model, type, fetchData, wss));


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
