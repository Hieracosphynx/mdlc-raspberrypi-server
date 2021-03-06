const express = require("express");
const { spawn } = require("child_process");
const Memory = require('../libs/Memory');
const router = express.Router();

// @method GET api/raspberry/temp
// @description Get temperature of Raspberry Pi
router.get("/temperature", async (req, res) => {
  try {
    const raspTemp = spawn("/opt/vc/bin/vcgencmd", ["measure_temp"]);
    raspTemp.stdout.setEncoding('utf-8')

    raspTemp.stdout.on("data", (data) => {
      let raspTempStr = data.toString().trim();
      raspTempStr = raspTempStr.replace(/[a-z='A-Z]/g, "");
      res.status(200).json({temp: raspTempStr})
    });

    raspTemp.stderr.on("data", (data) => {
      throw new Error("Something went wrong");
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Something went wrong!" });
  }
});

// @method GET api/raspberry/memory
// @description Get memory usage
router.get('/memory', async(req,res) => {
  try{
    const raspMem = spawn("cat", ['/proc/meminfo']);

    raspMem.stdout.on('data', data => {
      const raspMemStr = data.toString();
      const raspMemDetails = raspMemStr.split(/\n/g, 5);
      raspMemDetails.map(detail => {
        const index = raspMemDetails.indexOf(detail);
        raspMemDetails[index] = parseFloat(detail.replace(/\D/g, ''))
      })
      const newMem = new Memory(raspMemDetails);
      const { value, type } = newMem.getTotalUsedMemory();
      res.status(200).json({ mem: value, type: type });
    })

    raspMem.stderr.on('data', data => {
      throw new Error('Something went wrong');
    });  
  } catch(err) {
    console.error(err.message)
  };
});
module.exports = router;
