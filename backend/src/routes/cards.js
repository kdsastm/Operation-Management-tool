// src/routes/cards.js
const express = require("express");
const router = express.Router();



// // API endpoint to fetch card data
// router.get('/stats', async (req, res) => {
//   console.log("ashunml");
//   try {
//     const stats = await Project.aggregate([
//       {
//         $addFields: {
//           cleanedNFR: {
//             $replaceAll: {
//               input: {
//                 $trim: {
//                   input: { $toString: "$Raw NFR (excl admin charge) INR Cr" }, // Convert to string and trim
//                 },
//               },
//               find: "(", // Remove opening parenthesis
//               replacement: "",
//             },
//           },
//         },
//       },
//       {
//         $addFields: {
//           cleanedNFR: {
//             $replaceAll: {
//               input: "$cleanedNFR", // Use the cleaned value from the previous step
//               find: ")", // Remove closing parenthesis
//               replacement: "",
//             },
//           },
//         },
//       },
//       {
//         $group: {
//           _id: null,
//           totalPartners: { $addToSet: "$Engagement Partner" },
//           totalProjects: { $addToSet: "$Project Name" },
//           totalNFR: {
//             $sum: {
//               $cond: {
//                 if: {
//                   $and: [
//                     { $ne: ["$cleanedNFR", ""] }, // Check for empty strings
//                     { $ne: ["$cleanedNFR", null] }, // Check for null values
//                     { $regexMatch: { input: "$cleanedNFR", regex: /^-?\d+(\.\d+)?$/ } }, // Check if it's a valid number
//                   ],
//                 },
//                 then: { $toDouble: "$cleanedNFR" }, // Convert to double if valid
//                 else: 0, // Default to 0 if invalid
//               },
//             },
//           },
//           totalCountry: { $addToSet: "$Employee Location" },
//           totalClient: { $addToSet: "$Client Name" },
//         },
//       },
//       {
//         $project: {
//           _id: 0,
//           totalPartners: { $size: "$totalPartners" },
//           totalProjects: { $size: "$totalProjects" },
//           totalCountry: { $size: "$totalCountry" },
//           totalClient: { $size: "$totalClient" },
//           totalNFR: 1,
//         },
//       },
//     ]);

//     res.json(stats[0]); // Return the first (and only) result
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

module.exports = router;