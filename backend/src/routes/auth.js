const express = require("express");
const User = require("../models/User");
// const Revenue = require("../models/Revenue");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Signup Route
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const user = new User({ email, password });
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Signin Route
router.post("/signin", async (req, res) => {
    console.log("akdnkand");
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
router.get('/stats', async (req, res) => {
  try {
    console.log("Sample data111:");
    const db = mongoose.connection.db;
    const collection = db.collection('Revenue');
    const stats = await collection.aggregate([
      {
        '$addFields': {
          'cleanedNFR': {
            '$replaceAll': {
              'input': {
                '$trim': {
                  'input': {
                    '$toString': '$Raw NFR (excl admin charge) INR Cr'
                  }
                }
              }, 
              'find': '(', 
              'replacement': ''
            }
          }
        }
      }, {
        '$addFields': {
          'cleanedNFR': {
            '$replaceAll': {
              'input': '$cleanedNFR', 
              'find': ')', 
              'replacement': ''
            }
          }
        }
      }, {
        '$group': {
          '_id': null, 
          'totalPartners': {
            '$addToSet': '$Engagement Partner'
          }, 
          'totalProjects': {
            '$addToSet': '$Project Name'
          }, 
          'totalNFR': {
            '$sum': {
              '$cond': {
                'if': {
                  '$and': [
                    {
                      '$ne': [
                        '$cleanedNFR', ''
                      ]
                    }, {
                      '$ne': [
                        '$cleanedNFR', null
                      ]
                    }, {
                      '$regexMatch': {
                        'input': '$cleanedNFR', 
                        'regex': '^-?\\d+(\\.\\d+)?$'
                      }
                    }
                  ]
                }, 
                'then': {
                  '$toDouble': '$cleanedNFR'
                }, 
                'else': 0
              }
            }
          }, 
          'totalCountry': {
            '$addToSet': '$Employee Location'
          }, 
          'totalClient': {
            '$addToSet': '$Client Name'
          }
        }
      }, {
        '$project': {
          '_id': 0, 
          'totalPartners': {
            '$size': '$totalPartners'
          }, 
          'totalProjects': {
            '$size': '$totalProjects'
          }, 
          'totalCountry': {
            '$size': '$totalCountry'
          }, 
          'totalClient': {
            '$size': '$totalClient'
          }, 
          'totalNFR': 1
        }
      }
    ]).toArray();

    res.json(stats[0]); // Return the first (and only) result
    
  } catch (err) {
    console.error("Error in /stats route:", err); // <--- This is important
  res.status(500).json({ message: err.message });
  }
});

router.get('/clientnfr', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const collection = db.collection('Revenue');
    const clientnfr = await collection.aggregate([
      {
        $addFields: {
          cleanedNFR: {
            $replaceAll: {
              input: {
                $trim: {
                  input: { $toString: "$Raw NFR (excl admin charge) INR Cr" }
                }
              },
              find: "(",
              replacement: ""
            }
          }
        }
      },
      {
        $addFields: {
          cleanedNFR: {
            $replaceAll: {
              input: "$cleanedNFR",
              find: ")",
              replacement: ""
            }
          }
        }
      },
      {
        $match: {
          cleanedNFR: { $ne: null },
          $expr: {
            $regexMatch: {
              input: "$cleanedNFR",
              regex: "^-?\\d+(\\.\\d+)?$"
            }
          }
        }
      },
      {
        $group: {
          _id: "$Client Name",
          totalNFR: { $sum: { $toDouble: "$cleanedNFR" } }
        }
      },
      {
        $sort: { totalNFR: -1 }
      },
      {
        $group: {
          _id: null,
          clientNames: { $push: "$_id" },
          nfrValues: { $push: "$totalNFR" }
        }
      },
      {
        $project: {
          _id: 0,
          clientNames: 1,
          nfrValues: 1
        }
      }
    ]
    ).toArray();

    res.json(clientnfr[0]); // Return the first (and only) result
    
  } catch (err) {
    console.error("Error in /stats route:", err); // <--- This is important
  res.status(500).json({ message: err.message });
  }
});
router.get('/revenuetrend', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const collection = db.collection('Revenue');
    const revenuetrend = await collection.aggregate(
      [
        {
          $addFields: {
            monthDate: { $toDate: "$End date of the month" },
            cleanedNFR: {
              $trim: {
                input: {
                  $toString: "$Raw NFR (excl admin charge) INR Cr"
                }
              }
            }
          }
        },
        {
          $match: {
            cleanedNFR: {
              $ne: null
            },
            $expr: {
              $regexMatch: {
                input: "$cleanedNFR",
                regex: "^-?\\d+(\\.\\d+)?$"  // Matches numbers only
              }
            }
          }
        },
        {
          $addFields: {
            monthParts: {
              $dateToParts: {
                date: "$monthDate"
              }
            }
          }
        },
        {
          $addFields: {
            monthLabel: {
              $arrayElemAt: [
                ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                "$monthParts.month"
              ]
            },
            yearShort: {
              $substr: [{ $toString: "$monthParts.year" }, 2, 2]
            },
            nfrNumber: {
              $toDouble: "$cleanedNFR"
            }
          }
        },
        {
          $addFields: {
            monthYear: {
              $concat: ["$monthLabel", "-", "$yearShort"]
            }
          }
        },
        {
          $group: {
            _id: "$monthParts",
            label: { $first: "$monthYear" },
            totalRawNFR: { $sum: "$nfrNumber" }
          }
        },
        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1
          }
        },
        {
          $group: {
            _id: null,
            labels: { $push: "$label" },
            nfrValues: { $push: "$totalRawNFR" }
          }
        },
        {
          $project: {
            _id: 0,
            labels: 1,
            nfrValues: 1
          }
        }
      ]
            
    ).toArray();

    res.json(revenuetrend[0]); // Return the first (and only) result
    
  } catch (err) {
    console.error("Error in /revenuetrend route:", err); // <--- This is important
  res.status(500).json({ message: err.message });
  }
});


module.exports = router;